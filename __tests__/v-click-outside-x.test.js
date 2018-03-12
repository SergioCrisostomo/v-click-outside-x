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
    ['bind', 'unbind'].forEach((name) => {
      expect(directive[name]).toBeInstanceOf(Function);
    });
  });

  it('$_captureInstances is an empty Map', () => {
    // expect(directive.$_captureInstances).toBeInstanceOf(Map);
    expect(Object.keys(directive.$_captureInstances)).toHaveLength(0);
  });

  it('$_nonCaptureInstances is an empty Map', () => {
    // expect(directive.$_nonCaptureInstances).toBeInstanceOf(Map);
    expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(0);
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
    });

    describe('single', () => {
      const div1 = document.createElement('div');

      it('adds to the list and event listener', () => {
        const eventHandler = jest.fn();

        directive.bind(div1, {value: eventHandler});

        expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(1);
        expect(directive.$_nonCaptureInstances).toHaveProperty('click');

        const clickInstances = directive.$_nonCaptureInstances.click;

        expect(clickInstances).toBeInstanceOf(Array);
        expect(clickInstances).toHaveLength(1);
        expect(clickInstances.find(item => item.el === div1)).toBeDefined();
        expect(document.addEventListener.mock.calls).toHaveLength(1);
      });

      it('removes from the list and event listener', () => {
        directive.unbind(div1);

        expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(0);
        expect(document.removeEventListener.mock.calls).toHaveLength(1);
      });
    });

    describe('multiple', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');

      it('adds to the list and event listener', () => {
        const eventHandler1 = jest.fn();
        const eventHandler2 = jest.fn();

        directive.bind(div1, {value: eventHandler1});
        directive.bind(div2, {arg: 'click', value: eventHandler2});

        expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(1);
        expect(directive.$_nonCaptureInstances).toHaveProperty('click');

        const clickInstances = directive.$_nonCaptureInstances.click;

        expect(clickInstances).toBeInstanceOf(Array);
        expect(clickInstances).toHaveLength(2);

        expect(clickInstances.find(item => item.el === div1)).toBeDefined();
        expect(clickInstances.find(item => item.el === div2)).toBeDefined();
        expect(document.addEventListener.mock.calls).toHaveLength(1);
      });

      it('removes from the list and the event listener', () => {
        directive.unbind(div1);

        expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(1);
        expect(directive.$_nonCaptureInstances).toHaveProperty('click');

        const clickInstances = directive.$_nonCaptureInstances.click;

        expect(clickInstances).toBeInstanceOf(Array);
        expect(clickInstances).toHaveLength(1);
        expect(clickInstances.find(item => item.el === div2)).toBeDefined();

        directive.unbind(div2);

        expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(0);
        expect(document.removeEventListener.mock.calls).toHaveLength(1);
      });
    });

    describe('bind', () => {
      it('saves the instance binding and element', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const eventHandler1 = jest.fn();
        const eventHandler2 = jest.fn();

        directive.bind(div1, {arg: 'pointerdown', modifiers: {capture: true}, value: eventHandler1});
        directive.bind(div2, {arg: 'pointerdown', modifiers: {stop: true}, value: eventHandler2});
        directive.bind(div3, {arg: 'pointerdown', modifiers: {prevent: true}, value: eventHandler2});

        expect(Object.keys(directive.$_captureInstances)).toHaveLength(1);
        expect(directive.$_captureInstances).toHaveProperty('pointerdown');

        const clickCaptureInstances = directive.$_captureInstances.pointerdown;

        expect(clickCaptureInstances).toBeInstanceOf(Array);
        expect(clickCaptureInstances).toHaveLength(1);

        expect(clickCaptureInstances.find(item => item.el === div1)).toEqual({
          binding: {
            arg: 'pointerdown',
            modifiers: {
              capture: true,
              prevent: false,
              stop: false,
            },
            value: eventHandler1,
          },
          el: div1,
        });

        expect(Object.keys(directive.$_nonCaptureInstances)).toHaveLength(1);
        expect(directive.$_nonCaptureInstances).toHaveProperty('pointerdown');

        const clickNonCaptureInstances = directive.$_nonCaptureInstances.pointerdown;

        expect(clickNonCaptureInstances).toBeInstanceOf(Array);
        expect(clickNonCaptureInstances).toHaveLength(2);

        expect(clickNonCaptureInstances.find(item => item.el === div2)).toEqual({
          binding: {
            arg: 'pointerdown',
            modifiers: {
              capture: false,
              prevent: false,
              stop: true,
            },
            value: eventHandler2,
          },
          el: div1,
        });

        expect(clickNonCaptureInstances.find(item => item.el === div3)).toEqual({
          binding: {
            arg: 'pointerdown',
            modifiers: {
              capture: false,
              prevent: true,
              stop: false,
            },
            value: eventHandler2,
          },
          el: div1,
        });

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

      const eventHandler1 = jest.fn();

      directive.bind(div1, {value: eventHandler1});
      directive.$_onNonCaptureEvent(event);

      expect(eventHandler1).toHaveBeenCalledWith(event);
      expect(eventHandler1.mock.instances).toHaveLength(1);
      expect(eventHandler1.mock.instances[0]).toBe(directive);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();

      directive.unbind(div1);

      const eventHandler2 = jest.fn();

      directive.bind(div1, {arg: 'touchdown', modifiers: {capture: true, prevent: true, stop: true}, value: eventHandler2});
      directive.$_onCaptureEvent(event);

      expect(eventHandler2).toHaveBeenCalledWith(event);
      expect(eventHandler2.mock.instances).toHaveLength(1);
      expect(eventHandler2.mock.instances[0]).toBe(directive);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();

      directive.unbind(div1);
    });

    it('does not execute the callback if the event target its the element from the instance', () => {
      const event = {
        target: div1,
      };

      const eventHandler = jest.fn();

      directive.bind(div1, {value: eventHandler});
      directive.$_onCaptureEvent(event);

      expect(eventHandler).not.toHaveBeenCalled();
      expect(eventHandler.mock.instances).toHaveLength(0);

      directive.unbind(div1);
    });
  });
});
