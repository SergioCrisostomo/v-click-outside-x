import noop from 'lodash/noop';
import clickOutside from '../dist/v-click-outside-x';

const plugin = clickOutside;
const {
  directive,
} = clickOutside;

describe('v-click-outside -> plugin', () => {
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
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  const a = document.createElement('a');

  afterEach(() => {
    directive.$_instances = [];
    directive.$_events = ['pointerdown'];
  });

  it('it has bind, update and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function');
    expect(typeof directive.update).toBe('function');
    expect(typeof directive.unbind).toBe('function');
  });

  describe('bind', () => {
    it('adds an element to the $_instances list and adds an event listener (On non mobile devices)', () => {
      directive.$_events = ['pointerdown'];
      document.addEventListener = jest.fn();
      directive.bind(div1, {});

      expect(directive.$_instances).toHaveLength(1);
      expect(directive.$_instances[0].el).toBe(div1);
      expect(document.addEventListener.mock.calls).toHaveLength(1);
    });

    it('adds multiple elements to the $_instances list and adds an event listener (On mobile devices)', () => {
      document.addEventListener = jest.fn();
      directive.$_events = ['pointerdown'];
      directive.bind(div1, {});
      directive.bind(div2, {});

      expect(directive.$_instances).toHaveLength(2);
      expect(directive.$_instances[1].el).toBe(div2);
      expect(document.addEventListener.mock.calls).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('throws an error if value is not a function', () => {
      const updateWithNoFunction = () => directive.update(div1, {});

      expect(updateWithNoFunction).toThrowError(/Argument must be a function/);
    });

    it('saves the callback function', () => {
      directive.bind(div1, {});
      directive.update(div1, {
        value: noop,
      });

      expect(directive.$_instances[0].fn).toBe(noop);
    });
  });

  describe('unbind', () => {
    it('removes the instance of the list and the event listener (On non mobile devices)', () => {
      directive.$_events = ['pointerdown'];
      document.removeEventListener = jest.fn();
      directive.bind(div1, {});
      directive.unbind(div1);

      expect(directive.$_instances).toHaveLength(0);
      expect(document.removeEventListener.mock.calls).toHaveLength(1);
    });

    it('removes the instance of the list and the event listener (On mobile devices)', () => {
      directive.$_events = ['pointerdown'];
      document.removeEventListener = jest.fn();
      directive.bind(div1, {});
      directive.unbind(div1);

      expect(directive.$_instances).toHaveLength(0);
      expect(document.removeEventListener.mock.calls).toHaveLength(1);
    });

    it('removes multiple $_instances of the list and the event listener', () => {
      directive.$_events = ['pointerdown'];
      document.removeEventListener = jest.fn();
      directive.bind(div1, {});
      directive.bind(div2, {});
      directive.unbind(div1);

      expect(directive.$_instances[0].el).toBe(div2);

      directive.unbind(div2);

      expect(directive.$_instances).toHaveLength(0);
      expect(document.removeEventListener.mock.calls).toHaveLength(1);
    });
  });

  describe('$_onEvent', () => {
    it('calls the callback if the element is not the same and does not contains the event target', () => {
      const event = {
        target: a,
      };

      const cb = jest.fn();

      directive.bind(div1, {});
      directive.update(div1, {
        value: cb,
      });

      directive.$_onEvent(event);

      expect(cb).toHaveBeenCalledWith(event);
    });

    it('does not execute the callback if the event target its the element from the instance', () => {
      const event = {
        target: div1,
      };

      const cb = jest.fn();

      directive.bind(div1, {});
      directive.update(div1, {
        value: cb,
      });

      directive.$_onEvent(event);

      expect(cb).not.toHaveBeenCalled();
    });
  });
});
