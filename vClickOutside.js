const CLICK = 'click';
const captureInstances = new Map();
const nonCaptureInstances = new Map();
const instancesList = [captureInstances, nonCaptureInstances];

const commonHandler = function onCommonEvent(instances, event) {
  const {
    target,
  } = event;

  instances.forEach((instance) => {
    instance.forEach(({el, binding}) => {
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
      const normalisedBinding = {
        ...binding,
        arg,
        modifiers: {
          capture: false,
          prevent: false,
          stop: false,
          ...binding.modifiers,
        },
      };

      const useCapture = normalisedBinding.modifiers.capture;
      const instances = useCapture ? captureInstances : nonCaptureInstances;
      if (!instances.has(arg)) {
        instances.set(arg, []);
      }

      const typeList = instances.get(arg);

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
        if (instances.size > 0) {
          const useCapture = instances === captureInstances;

          instances.forEach((instance, eventName) => {
            const newInstance = instance.filter(directive => directive.el !== el);

            if (newInstance.length === 0) {
              const eventHandler = useCapture ? captureEventHandler : nonCaptureEventHandler;

              document.removeEventListener(eventName, eventHandler, useCapture);
              instances.delete(eventName);
            } else {
              instances.set(eventName, newInstance);
            }
          });
        }
      });
    },
  },
});
