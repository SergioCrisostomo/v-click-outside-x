const has = Function.call.bind(Object.prototype.hasOwnProperty);
const CLICK = 'click';
const captureInstances = {};
const nonCaptureInstances = {};
const instancesList = [captureInstances, nonCaptureInstances];

const commonHandler = function onCommonEvent(instances, event) {
  const {
    target,
  } = event;

  Object.keys(instances).forEach((eventName) => {
    instances[eventName].forEach(({el, binding}) => {
      if (target !== el && !el.contains(target)) {
        if (binding.modifiers.stop) {
          event.stopPropagation();
        }

        if (binding.modifiers.prevent) {
          event.preventDefault();
        }

        binding.value.call(this, event);
      }
    });
  });
};

const captureEventHandler = function onCaptureEvent(event) {
  commonHandler.call(this, captureInstances, event);
};

const nonCaptureEventHandler = function onNonCaptureEvent(event) {
  commonHandler.call(this, nonCaptureInstances, event);
};

export default Object.defineProperties({}, {
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
    value: function bind(el, binding) {
      if (typeof binding.value !== 'function') {
        throw new TypeError('Binding value must be a function.');
      }

      const arg = binding.arg || CLICK;
      const normalisedBinding = Object.assign({}, binding, {
        arg,
        modifiers: Object.assign({
          capture: false,
          prevent: false,
          stop: false,
        }, binding.modifiers),
      });

      const useCapture = normalisedBinding.modifiers.capture;
      const instances = useCapture ? captureInstances : nonCaptureInstances;
      if (!has(instances, arg)) {
        instances[arg] = [];
      }

      const typeList = instances[arg];

      typeList.push({el, binding: normalisedBinding});

      if (typeList.length === 1) {
        const eventHandler = useCapture ? captureEventHandler : nonCaptureEventHandler;

        document.addEventListener(arg, eventHandler, useCapture);
      }
    },
  },

  unbind: {
    value: function unbind(el) {
      instancesList.forEach((instances) => {
        const instanceKeys = Object.keys(instances);

        if (instanceKeys.length > 0) {
          const useCapture = instances === captureInstances;

          instanceKeys.forEach((eventName) => {
            const newInstance = instances[eventName].filter(directive => directive.el !== el);

            if (newInstance.length < 1) {
              const eventHandler = useCapture ? captureEventHandler : nonCaptureEventHandler;

              document.removeEventListener(eventName, eventHandler, useCapture);
              delete instances[eventName]; // eslint-disable-line no-param-reassign
            } else {
              instances[eventName] = newInstance; // eslint-disable-line no-param-reassign
            }
          });
        }
      });
    },
  },
});
