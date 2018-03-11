import directive from './vClickOutside';

export default {
  directive,
  install(Vue) {
    Vue.directive('click-outside', directive);
  },
};
