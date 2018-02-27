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
    ['bind', 'componentUpdated', 'inserted', 'update', 'unbind'].forEach((name) => {
      expect(directive[name]).toBeInstanceOf(Function);
    });
  });

  it('$_captureInstances is an empty Map', () => {
    // expect(directive.$_captureInstances).toBeInstanceOf(Map);
    expect(directive.$_captureInstances.size).toBe(0);
  });

  it('$_nonCaptureInstances is an empty Map', () => {
    // expect(directive.$_nonCaptureInstances).toBeInstanceOf(Map);
    expect(directive.$_nonCaptureInstances.size).toBe(0);
  });

  it('$_eventName is the string `click`', () => {
    expect(directive.$_eventName).toBe('click');
  });

  it('$_onCaptureEvent to be a function', () => {
    expect(directive.$_onCaptureEvent).toBeInstanceOf(Function);
  });

  it('$_onNonCaptureEvent to be a function', () => {
    expect(directive.$_onNonCaptureEvent).toBeInstanceOf(Function);
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

      it('throws an error if element is already bound', () => {
        const div1 = document.createElement('div');
        const mock = jest.fn();

        directive.bind(div1, {value: mock});
        const alreadyBound = () => directive.bind(div1, {value: mock});

        expect(alreadyBound).toThrowError(/element is already bound/);

        directive.unbind(div1);
        expect(directive.$_nonCaptureInstances.size).toBe(0);
      });
    });

    describe('single', () => {
      const div1 = document.createElement('div');

      it('adds to the list and event listener', () => {
        const mock = jest.fn();

        directive.bind(div1, {value: mock});

        expect(directive.$_nonCaptureInstances.size).toBe(1);
        expect(directive.$_nonCaptureInstances.has(div1)).toBe(true);
        expect(document.addEventListener.mock.calls).toHaveLength(1);
      });

      it('removes from the list and event listener', () => {
        directive.unbind(div1);

        expect(directive.$_nonCaptureInstances.size).toBe(0);
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

        expect(directive.$_nonCaptureInstances.size).toBe(2);
        expect(directive.$_nonCaptureInstances.has(div1)).toBe(true);
        expect(directive.$_nonCaptureInstances.has(div2)).toBe(true);
        expect(document.addEventListener.mock.calls).toHaveLength(1);
      });

      it('removes from the list and the event listener', () => {
        directive.unbind(div1);

        expect(directive.$_nonCaptureInstances.size).toBe(1);
        expect(directive.$_nonCaptureInstances.has(div1)).toBe(false);
        expect(directive.$_nonCaptureInstances.has(div2)).toBe(true);

        directive.unbind(div2);

        expect(directive.$_nonCaptureInstances.size).toBe(0);
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

        expect(directive.$_captureInstances.size).toBe(1);
        expect(directive.$_captureInstances.get(div1)).toEqual({modifiers: modifiers1, el: div1, value: mock1});

        expect(directive.$_nonCaptureInstances.size).toBe(2);
        expect(directive.$_nonCaptureInstances.get(div2)).toEqual({modifiers: modifiers2, el: div2, value: mock2});
        expect(directive.$_nonCaptureInstances.get(div3)).toEqual({modifiers: modifiers3, el: div3, value: mock2});

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
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: a,
      };

      const mock1 = jest.fn();

      directive.bind(div1, {value: mock1});
      directive.$_onNonCaptureEvent(event);

      expect(mock1).toHaveBeenCalledWith(event);
      expect(mock1.mock.instances).toHaveLength(1);
      expect(mock1.mock.instances[0]).toBe(directive);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();

      directive.unbind(div1);

      const mock2 = jest.fn();

      directive.bind(div1, {modifiers: {capture: true, prevent: true, stop: true}, value: mock2});
      directive.$_onCaptureEvent(event);

      expect(mock2).toHaveBeenCalledWith(event);
      expect(mock2.mock.instances).toHaveLength(1);
      expect(mock2.mock.instances[0]).toBe(directive);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();

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
