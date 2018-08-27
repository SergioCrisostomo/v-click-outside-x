const CLICK = 'click';
const captureInstances = Object.create(null);
const nonCaptureInstances = Object.create(null);
const instancesList = [captureInstances, nonCaptureInstances];

const commonHandler = function _onCommonEvent(context, instances, event) {
  const {target} = event;

  const itemIteratee = function _itemIteratee(item) {
    const {el} = item;

    if (el !== target && !el.contains(target)) {
      const {binding} = item;

      if (binding.modifiers.stop) {
        event.stopPropagation();
      }

      if (binding.modifiers.prevent) {
        event.preventDefault();
      }

      binding.value.call(context, event);
    }
  };

  const keysIteratee = function _keysIteratee(eventName) {
    return instances[eventName].forEach(itemIteratee);
  };

  Object.keys(instances).forEach(keysIteratee);
};

const captureEventHandler = function onCaptureEvent(event) {
  /* eslint-disable-next-line babel/no-invalid-this */
  commonHandler(this, captureInstances, event);
};

const nonCaptureEventHandler = function onNonCaptureEvent(event) {
  /* eslint-disable-next-line babel/no-invalid-this */
  commonHandler(this, nonCaptureInstances, event);
};

const getEventHandler = function _getEventHandler(useCapture) {
  return useCapture ? captureEventHandler : nonCaptureEventHandler;
};

export const directive = Object.defineProperties(
  {},
  {
    $_captureInstances: {
      value: captureInstances,
    },

    $_nonCaptureInstances: {
      value: nonCaptureInstances,
    },

    $_onCaptureEvent: {
      value: captureEventHandler,
    },

    $_onNonCaptureEvent: {
      value: nonCaptureEventHandler,
    },

    bind: {
      value: function bind(el, binding) {
        if (typeof binding.value !== 'function') {
          throw new TypeError('Binding value must be a function.');
        }

        const arg = binding.arg || CLICK;
        const normalisedBinding = {
          ...binding,
          ...{
            arg,
            modifiers: {
              ...{
                capture: false,
                prevent: false,
                stop: false,
              },
              ...binding.modifiers,
            },
          },
        };

        const useCapture = normalisedBinding.modifiers.capture;
        const instances = useCapture ? captureInstances : nonCaptureInstances;
        if (!Array.isArray(instances[arg])) {
          instances[arg] = [];
        }

        if (instances[arg].push({el, binding: normalisedBinding}) === 1) {
          if (typeof document === 'object' && document) {
            document.addEventListener(
              arg,
              getEventHandler(useCapture),
              useCapture,
            );
          }
        }
      },
    },

    unbind: {
      value: function unbind(el) {
        const compareElements = function _compareElements(item) {
          return item.el !== el;
        };

        const instancesIteratee = function _instancesIteratee(instances) {
          const instanceKeys = Object.keys(instances);

          if (instanceKeys.length) {
            const useCapture = instances === captureInstances;

            const keysIteratee = function _keysIteratee(eventName) {
              const newInstance = instances[eventName].filter(compareElements);

              if (newInstance.length) {
                instances[eventName] = newInstance;
              } else {
                if (typeof document === 'object' && document) {
                  document.removeEventListener(
                    eventName,
                    getEventHandler(useCapture),
                    useCapture,
                  );
                }

                delete instances[eventName];
              }
            };

            instanceKeys.forEach(keysIteratee);
          }
        };

        instancesList.forEach(instancesIteratee);
      },
    },
  },
);

export function install(Vue) {
  Vue.directive('click-outside', directive);
}
