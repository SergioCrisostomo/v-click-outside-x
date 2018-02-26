<a href="https://travis-ci.org/Xotic750/v-click-outside-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/v-click-outside-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/v-click-outside-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/v-click-outside-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/v-click-outside-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/v-click-outside-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/v-click-outside-x" title="npm version">
<img src="https://badge.fury.io/js/v-click-outside-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_regexp-escape-x"></a>

# v-click-outside-x

Vue directive to react on clicks outside an element.


## Install

```bash
$ npm install --save v-click-outside-x
```

```bash
$ yarn add v-click-outside-x
```


## Use

```js
import Vue from 'vue'
import vClickOutside from 'v-click-outside-x'

Vue.use(vClickOutside)
```

```js
<script>
  export default {
    methods: {
      onClickOutside (event) {
        console.log('Clicked outside. Event: ', event)
      }
    }
  };
</script>

<template>
  <div v-click-outside="onClickOutside"></div>
</template>
```

Or use it as a directive

```js
import vClickOutside from 'v-click-outside-x'

<script>
  export default {
    directives: {
      clickOutside: vClickOutside.directive
    },
    methods: {
      onClickOutside (event) {
        console.log('Clicked outside. Event: ', event)
      }
    }
  };
</script>

<template>
  <div v-click-outside="onClickOutside"></div>
</template>
```

## License
[MIT License](https://github.com/ndelvalle/v-click-outside-x/blob/master/LICENSE)
