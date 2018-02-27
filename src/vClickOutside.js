import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import noop from 'lodash/noop';

const eventName = 'pointerdown';
const instances = [];
const eventHandler = function onEvent(event) {
  const {
    target,
  } = event;

  forEach(instances, ({el, value}) => {
    if (target !== el && !el.contains(target)) {
      value.call(this, event);
    }
  });
};

export default Object.defineProperties({}, {
  $_eventName: {
    get() {
      return eventName;
    },
  },

  $_instances: {
    get() {
      return map(instances, item => ({
        ...item,
      }));
    },
  },

  $_onEvent: {
    get() {
      return eventHandler;
    },
  },

  bind: {
    value: function bind(el, {modifiers = {}, value}) {
      if (typeof value !== 'function') {
        throw new TypeError('value must be a function');
      }

      const capture = !!modifiers.capture;

      if (instances.push({capture, el, value}) === 1) {
        document.addEventListener(eventName, eventHandler, capture);
      }
    },
  },

  componentUpdated: {
    configurable: true,
    value: noop,
  },

  inserted: {
    configurable: true,
    value: noop,
  },

  unbind: {
    value: function unbind(el) {
      const index = findIndex(instances, item => item.el === el);
      const removed = instances.splice(index, 1);

      if (instances.length === 0) {
        document.removeEventListener(eventName, eventHandler, removed[0].capture);
      }
    },
  },

  update: {
    configurable: true,
    value: noop,
  },
});
