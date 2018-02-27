import forEach from 'lodash/forEach';
import clickOutside from '../dist/v-click-outside-x';

const plugin = clickOutside;
const {
  directive,
} = clickOutside;

describe('v-click-outside -> plugin', () => {
  it('the directive is an object', () => {
    expect(directive).toBeInstanceOf(Object);
  });

  it('it has all hook functions available', () => {
    forEach(['bind', 'componentUpdated', 'inserted', 'update', 'unbind'], (name) => {
      expect(directive[name]).toBeInstanceOf(Function);
    });
  });

  it('$_nonCaptureInstances is an empty array', () => {
    expect(directive.$_nonCaptureInstances).toBeInstanceOf(Array);
    expect(directive.$_nonCaptureInstances).toHaveLength(0);
  });

  it('$_eventName is the string `click`', () => {
    expect(directive.$_eventName).toBe('click');
  });

  it('$_onCaptureEvent to be a function', () => {
    expect(directive.$_onCaptureEvent).toBeInstanceOf(Function);
  });

  it('install the directive into the vue instance', () => {
    const vue = {
      directive: jest.fn(),
    };

    plugin.install(vue);

    expect(vue.directive).toHaveBeenCalledWith('click-outside', directive);
    expect(vue.directive).toHaveBeenCalledTimes(1);
  });
});

describe('v-click-outside -> directive', () => {
  afterEach(() => {
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
  });

  afterEach(() => {
    document.addEventListener = undefined;
    document.removeEventListener = undefined;
  });

  describe('bind/unbind', () => {
    describe('bind exceptions', () => {
      it('throws an error if value is not a function', () => {
        const div1 = document.createElement('div');

        const bindWithNoFunction = () => directive.bind(div1, {});

        expect(bindWithNoFunction).toThrowError(/value must be a function/);
      });
    });

    describe('single', () => {
      const div1 = document.createElement('div');

      it('adds to the list and event listener', () => {
        const mock = jest.fn();

        directive.bind(div1, {value: mock});

        expect(directive.$_nonCaptureInstances).toHaveLength(1);
        expect(directive.$_nonCaptureInstances[0].el).toBe(div1);
        expect(document.addEventListener.mock.calls).toHaveLength(1);
      });

      it('removes from the list and event listener', () => {
        directive.unbind(div1);

        expect(directive.$_nonCaptureInstances).toHaveLength(0);
        expect(document.removeEventListener.mock.calls).toHaveLength(1);
      });
    });

    describe('multiple', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');

      it('adds to the list and event listener', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();

        directive.bind(div1, {value: mock1});
        directive.bind(div2, {value: mock2});

        expect(directive.$_nonCaptureInstances).toHaveLength(2);
        expect(directive.$_nonCaptureInstances[1].el).toBe(div2);
        expect(document.addEventListener.mock.calls).toHaveLength(1);
      });

      it('removes from the list and the event listener', () => {
        directive.unbind(div1);

        expect(directive.$_nonCaptureInstances[0].el).toBe(div2);

        directive.unbind(div2);

        expect(directive.$_nonCaptureInstances).toHaveLength(0);
        expect(document.removeEventListener.mock.calls).toHaveLength(1);
      });
    });

    describe('bind', () => {
      it('saves the instance binding and element', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        const binding1 = {modifiers: {capture: true}, value: mock1};
        const binding2 = {modifiers: {stop: true}, value: mock2};
        const binding3 = {modifiers: {prevent: true}, value: mock2};
        const modifiers1 = {
          capture: true,
          prevent: false,
          stop: false,
        };

        const modifiers2 = {
          capture: false,
          prevent: false,
          stop: true,
        };

        const modifiers3 = {
          capture: false,
          prevent: true,
          stop: false,
        };

        directive.bind(div1, binding1);
        directive.bind(div2, binding2);
        directive.bind(div3, binding3);

        expect(directive.$_captureInstances[0]).toEqual({modifiers: modifiers1, el: div1, value: mock1});

        expect(directive.$_nonCaptureInstances[0]).toEqual({modifiers: modifiers2, el: div2, value: mock2});
        expect(directive.$_nonCaptureInstances[1]).toEqual({modifiers: modifiers3, el: div3, value: mock2});

        directive.unbind(div1);
        directive.unbind(div2);
        directive.unbind(div3);
      });
    });
  });

  describe('$_onCaptureEvent', () => {
    const div1 = document.createElement('div');

    it('calls the callback if the element is not the same and does not contains the event target', () => {
      const a = document.createElement('a');
      const event = {
        target: a,
      };

      const mock1 = jest.fn();

      directive.bind(div1, {value: mock1});
      directive.$_onNonCaptureEvent(event);

      expect(mock1).toHaveBeenCalledWith(event);
      expect(mock1.mock.instances).toHaveLength(1);
      expect(mock1.mock.instances[0]).toBe(directive);

      directive.unbind(div1);

      const mock2 = jest.fn();

      directive.bind(div1, {modifiers: {capture: true}, value: mock2});
      directive.$_onCaptureEvent(event);

      expect(mock2).toHaveBeenCalledWith(event);
      expect(mock2.mock.instances).toHaveLength(1);
      expect(mock2.mock.instances[0]).toBe(directive);

      directive.unbind(div1);
    });

    it('does not execute the callback if the event target its the element from the instance', () => {
      const event = {
        target: div1,
      };

      const mock = jest.fn();

      directive.bind(div1, {value: mock});
      directive.$_onCaptureEvent(event);

      expect(mock).not.toHaveBeenCalled();
      expect(mock.mock.instances).toHaveLength(0);

      directive.unbind(div1);
    });
  });
});
