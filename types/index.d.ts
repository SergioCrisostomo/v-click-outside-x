import {PluginFunction, DirectiveOptions} from 'vue';

declare const install: PluginFunction<void>;
declare const directive: DirectiveOptions;

export {install, directive};
