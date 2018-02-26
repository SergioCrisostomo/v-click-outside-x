import 'handjs';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';


const directive = {
  $_instances: [],

  $_events: ['pointerdown'],

  $_onEvent(event) {
    forEach(directive.$_instances, (instance) => {
      if (typeof instance.fn === 'function' && event.target !== instance.el && !instance.el.contains(event.target)) {
        instance.fn(event);
      }
    });
  },

  bind(el, binding) {
    directive.$_instances.push({
      el,
      fn: binding.value,
    });

    if (directive.$_instances.length === 1) {
      forEach(directive.$_events, (eventType) => {
        document.addEventListener(eventType, directive.$_onEvent);
      });
    }
  },

  unbind(el) {
    const instanceIndex = findIndex(directive.$_instances, instance => instance.el === el);

    directive.$_instances.splice(instanceIndex, 1);

    if (directive.$_instances.length === 0) {
      forEach(directive.$_events, (eventType) => {
        document.removeEventListener(eventType, directive.$_onEvent);
      });
    }
  },

  update(el, binding) {
    if (typeof binding.value !== 'function') {
      throw new TypeError('Argument must be a function');
    }

    const foundInstance = find(directive.$_instances, instance => instance.el === el);

    foundInstance.fn = binding.value;
  },
};

export default directive;
