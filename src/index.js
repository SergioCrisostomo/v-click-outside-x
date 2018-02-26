import directive from './vClickOutside';

const plugin = {
  install(Vue) {
    Vue.directive('click-outside', directive);
  },
  directive,
};

export default plugin;
