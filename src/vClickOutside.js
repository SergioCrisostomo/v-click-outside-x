import noop from 'lodash/noop';

const DEFAULT_MODIFIERS = Object.freeze({
  capture: false,
  prevent: false,
  stop: false,
});

const eventName = 'click';
const captureInstances = new Map();
const nonCaptureInstances = new Map();
const instancesList = Object.freeze([captureInstances, nonCaptureInstances]);

const commonHandler = function onCommonEvent(instances, event) {
  const {
    target,
  } = event;

  instances.forEach(({modifiers, value}, el) => {
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

export default Object.defineProperties({}, {
  $_eventName: {
    get() {
      return eventName;
    },
  },

  $_captureInstances: {
    get() {
      return captureInstances;
    },
  },

  $_nonCaptureInstances: {
    get() {
      return nonCaptureInstances;
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

      const modifiersWithDefaults = {...DEFAULT_MODIFIERS, ...modifiers};
      const useCapture = modifiersWithDefaults.capture;
      const instances = useCapture ? captureInstances : nonCaptureInstances;

      if (instances.has(el)) {
        throw new Error('element is already bound');
      }

      instances.set(el, {el, modifiers: modifiersWithDefaults, value});

      if (instances.size === 1) {
        const eventHandler = useCapture ? captureEventHandler : nonCaptureEventHandler;

        document.addEventListener(eventName, eventHandler, useCapture);
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
      instancesList.forEach((instances) => {
        if (instances.size > 0) {
          instances.delete(el);

          if (instances.size === 0) {
            const useCapture = instances === captureInstances;
            const eventHandler = useCapture ? captureEventHandler : nonCaptureEventHandler;

            document.removeEventListener(eventName, eventHandler, useCapture);
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
