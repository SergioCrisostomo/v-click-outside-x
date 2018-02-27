import assign from 'lodash/assign';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import noop from 'lodash/noop';

const DEFAULT_MODIFIERS = Object.freeze({
  capture: false,
  prevent: false,
  stop: false,
});

const eventName = 'click';
const captureInstances = [];
const nonCaptureInstances = [];
const instancesList = Object.freeze([captureInstances, nonCaptureInstances]);

const findInstanceIndex = (instances, element) => findIndex(instances, ({el}) => el === element);

const commonHandler = function onCommonEvent(instances, event) {
  const {
    target,
  } = event;

  forEach(instances, ({el, modifiers, value}) => {
    if (target !== el && !el.contains(target)) {
      if (modifiers.stop) {
        event.stopPropagation();
      }

      if (modifiers.prevent) {
        event.preventDefault();
      }

      value.call(this, event);
    }
  });
};

const captureEventHandler = function onCaptureEvent(event) {
  commonHandler.call(this, captureInstances, event);
};

const nonCaptureEventHandler = function onNonCaptureEvent(event) {
  commonHandler.call(this, nonCaptureInstances, event);
};

const shallowCopyInstances = instances => map(instances, instance => assign({}, instance));

export default Object.defineProperties({}, {
  $_eventName: {
    get() {
      return eventName;
    },
  },

  $_captureInstances: {
    get() {
      return shallowCopyInstances(captureInstances);
    },
  },

  $_nonCaptureInstances: {
    get() {
      return shallowCopyInstances(nonCaptureInstances);
    },
  },

  $_onCaptureEvent: {
    get() {
      return captureEventHandler;
    },
  },

  $_onNonCaptureEvent: {
    get() {
      return nonCaptureEventHandler;
    },
  },

  bind: {
    value: function bind(el, {modifiers, value}) {
      if (typeof value !== 'function') {
        throw new TypeError('value must be a function');
      }

      const modifiersWithDefaults = assign({}, DEFAULT_MODIFIERS, modifiers);
      const instances = modifiersWithDefaults.capture ? captureInstances : nonCaptureInstances;

      if (instances.push({el, modifiers: modifiersWithDefaults, value}) === 1) {
        document.addEventListener(eventName, captureEventHandler, modifiersWithDefaults.capture);
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
      forEach(instancesList, (instances) => {
        const index = findInstanceIndex(instances, el);

        if (index !== -1) {
          const removedList = instances.splice(index, 1);

          if (instances.length === 0) {
            document.removeEventListener(eventName, captureEventHandler, removedList.pop().modifiers.capture);
          }
        }
      });
    },
  },

  update: {
    configurable: true,
    value: noop,
  },
});
