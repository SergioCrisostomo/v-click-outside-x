function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @typedef {import("../types/index.d.ts")} VClickOutsidePlugin
 */
var CLICK = 'click';
var captureInstances = Object.create(null);
var nonCaptureInstances = Object.create(null);
var captureEventHandlers = Object.create(null);
var nonCaptureEventHandlers = Object.create(null);
var instancesList = [captureInstances, nonCaptureInstances];
/**
 * The common event handler for bot capture and non-capture events.
 *
 * @param {!object} context - The event context.
 * @param {!object} instances - The capture or non-capture registered instances.
 * @param {Event} event - The event object.
 * @param {string} arg - The event type.
 * @returns {undefined} Default.
 */

var commonHandler = function _onCommonEvent(context, instances, event, arg) {
  var target = event.target;

  var itemIteratee = function _itemIteratee(item) {
    var el = item.el;

    if (el !== target && !el.contains(target)) {
      var binding = item.binding;

      if (binding.modifiers.stop) {
        event.stopPropagation();
      }

      if (binding.modifiers.prevent) {
        event.preventDefault();
      }

      binding.value.call(context, event);
    }
  };

  instances[arg].forEach(itemIteratee);
};
/**
 * Get the correct event handler: Capture or non-capture.
 *
 * @param {boolean} useCapture - Indicate which handler to use; 'true' to use
 *  capture handler or 'false' for non-capture.
 * @param {string} arg - The event type.
 * @returns {Function} - The event handler.
 */


var getEventHandler = function _getEventHandler(useCapture, arg) {
  if (useCapture) {
    if (captureEventHandlers[arg]) {
      return captureEventHandlers[arg];
    }
    /**
     * Event handler for capture events.
     *
     * @param {Event} event - The event object.
     */


    captureEventHandlers[arg] = function onCaptureEvent(event) {
      commonHandler(this, captureInstances, event, arg);
    };

    return captureEventHandlers[arg];
  }

  if (nonCaptureEventHandlers[arg]) {
    return nonCaptureEventHandlers[arg];
  }
  /**
   * Event handler for non-capture events.
   *
   * @param {Event} event - The event object.
   */


  nonCaptureEventHandlers[arg] = function onNonCaptureEvent(event) {
    commonHandler(this, nonCaptureInstances, event, arg);
  };

  return nonCaptureEventHandlers[arg];
};
/**
 * The directive definition.
 * {@link https://vuejs.org/v2/guide/custom-directive.html|Custom directive}.
 *
 * @type {VClickOutsidePlugin.directive}
 * @property {!object} $_captureInstances - Registered capture instances.
 * @property {!object} $_nonCaptureInstances - Registered non-capture instances.
 * @property {Function} $_onCaptureEvent - Event handler for capture events.
 * @property {Function} $_onNonCaptureEvent - Event handler for non-capture events.
 * @property {Function} bind - Called only once, when the directive is first
 *  bound to the element.
 * @property {Function} unbind - Called only once, when the directive is unbound
 *  from the element.
 * @property {string} version - The version number of this release.
 */


export var directive = Object.defineProperties({}, {
  $_captureInstances: {
    value: captureInstances
  },
  $_nonCaptureInstances: {
    value: nonCaptureInstances
  },
  $_captureEventHandlers: {
    value: captureEventHandlers
  },
  $_nonCaptureEventHandlers: {
    value: nonCaptureEventHandlers
  },
  bind: {
    value: function bind(el, binding) {
      if (typeof binding.value !== 'function') {
        throw new TypeError('Binding value must be a function.');
      }

      var arg = binding.arg || CLICK;

      var normalisedBinding = _objectSpread({}, binding, {}, {
        arg: arg,
        modifiers: _objectSpread({}, {
          capture: false,
          prevent: false,
          stop: false
        }, {}, binding.modifiers)
      });

      var useCapture = normalisedBinding.modifiers.capture;
      var instances = useCapture ? captureInstances : nonCaptureInstances;

      if (!Array.isArray(instances[arg])) {
        instances[arg] = [];
      }

      if (instances[arg].push({
        el: el,
        binding: normalisedBinding
      }) === 1) {
        if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document) {
          document.addEventListener(arg, getEventHandler(useCapture, arg), useCapture);
        }
      }
    }
  },
  unbind: {
    value: function unbind(el) {
      var compareElements = function _compareElements(item) {
        return item.el !== el;
      };

      var instancesIteratee = function _instancesIteratee(instances) {
        var instanceKeys = Object.keys(instances);

        if (instanceKeys.length) {
          var useCapture = instances === captureInstances;

          var keysIteratee = function _keysIteratee(eventName) {
            var newInstance = instances[eventName].filter(compareElements);

            if (newInstance.length) {
              instances[eventName] = newInstance;
            } else {
              if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document) {
                document.removeEventListener(eventName, getEventHandler(useCapture, eventName), useCapture);
              }

              delete instances[eventName];
            }
          };

          instanceKeys.forEach(keysIteratee);
        }
      };

      instancesList.forEach(instancesIteratee);
    }
  },

  /* Note: This needs to be manually updated to match package.json. */
  version: {
    enumerable: true,
    value: '4.0.9'
  }
});
/**
 * A Vue.js plugin should expose an install method. The method will be called
 * with the Vue constructor as the first argument, along with possible options.
 * {@link https://vuejs.org/v2/guide/plugins.html#Writing-a-Plugin|Writing a plugin}.
 *
 * @type {VClickOutsidePlugin.install}
 * @param {import("vue")} Vue - The Vue constructor.
 */

export function install(Vue) {
  Vue.directive('click-outside', directive);
}

//# sourceMappingURL=v-click-outside-x.esm.js.map