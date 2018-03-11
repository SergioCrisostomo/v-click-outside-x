/**
 * @file Manages the root configuration settings for project wide eslint.
 * @module eslint/root/configuration
 * @see {@link https://eslint.org} for further information.
 */

module.exports = {
  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#specifying-environments}
   */
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#extending-configuration-files}
   */
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:css-modules/recommended',
  ],

  /**
   * You can define global variables here.
   * @see {@link https://eslint.org/docs/user-guide/configuring#specifying-globals}
   */
  globals: {},

  /**
   * Sometimes a more fine-controlled configuration is necessary, for example if the configuration
   * for files within the same directory has to be different.
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns}
   */
  overrides: [
    {
      files: ['webpack.*.js', '__tests__/*.js'],
      rules: {
        'compat/compat': 'off',
        'global-require': 'off',
        'import/no-extraneous-dependencies': ['error', {
          devDependencies: true,
        }],
        'no-console': 'off',
      },
    },
  ],

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#specifying-parser-options}
   */
  parserOptions: {
    ecmaFeatures: {
      es6: true,
      impliedStrict: true,
    },
    ecmaVersion: 2017,
    parser: 'babel-eslint',
    sourceType: 'module',
  },

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuring-plugins}
   */
  plugins: [
    'babel',
    'compat',
    'css-modules',
    'eslint-comments',
    'html',
    'jest',
    'jsdoc',
    'json',
    'no-use-extend-native',
    'prefer-object-spread',
    'promise',
    'sort-class-members',
  ],

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy}
   */
  root: true,

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuring-rules}
   */
  rules: {
    /**
     * Eslint rules that differ from airbnb base.
     * @see {@link https://eslint.org/docs/rules/}
     */
    'global-require': 'warn',
    'max-len': ['error', 130],
    'object-curly-spacing': 'off',

    /**
     * Additional ESLint rules for ESLint's directive-comments.
     * @see {@link https://github.com/mysticatea/eslint-plugin-eslint-comments}
     */
    'eslint-comments/disable-enable-pair': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
    'eslint-comments/no-use': 'off',

    /**
     * An ESlint rule plugin companion to babel-eslint.
     * @see {@link https://github.com/babel/eslint-plugin-babel}
     */
    'babel/new-cap': 'error',
    'babel/no-invalid-this': 'off',
    'babel/object-curly-spacing': 'error',
    'babel/semi': 'error',

    /**
     * Lint the browser compatibility of your code.
     * Good to know during development so we make sure that we have all polyfill and transforms.
     * @see {@link https://github.com/amilajack/eslint-plugin-compat}
     */
    'compat/compat': process.env.NODE_ENV === 'production' ? 'off' : 'warn',

    /**
     * Helps you in tracking down problems when you are using css-modules.
     * @see {@link https://github.com/atfzl/eslint-plugin-css-modules}
     */
    'css-modules/no-undef-class': 'warn',
    'css-modules/no-unused-class': 'off',

    /**
     * ESLint plugin to prevent use of extended native objects.
     * @see {@link https://github.com/dustinspecker/eslint-plugin-no-use-extend-native}
     */
    'no-use-extend-native/no-use-extend-native': 'error',

    /**
     * ESLint plugin with rules that help validate proper imports.
     * @see {@link https://github.com/benmosher/eslint-plugin-import}
     */
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['build/webpack.*.js'],
    }],

    /**
     * ESLint plugin for Jest.
     * @see {@link https://github.com/jest-community/eslint-plugin-jest}
     */
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',

    /**
     * JSDoc specific linting rules for ESLint.
     * @see {@link https://github.com/gajus/eslint-plugin-jsdoc}
     */
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/newline-after-description': 'warn',
    'jsdoc/require-description-complete-sentence': 'warn',
    'jsdoc/require-example': 'off',
    'jsdoc/require-hyphen-before-param-description': 'warn',
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',

    /**
     * ESLint rule for suggesting that object spread properties be used.
     * @see {@link https://github.com/bryanrsmith/eslint-plugin-prefer-object-spread}
     */
    'prefer-object-spread/prefer-object-spread': 'off',

    /**
     * An ESLint rule for enforcing consistent ES6 class member order.
     * @see {@link https://github.com/bryanrsmith/eslint-plugin-sort-class-members}
     */
    'sort-class-members/sort-class-members': ['error', {
      accessorPairPositioning: 'getThenSet',
      order: [
        '[static-properties]',
        '[static-methods]',
        '[properties]',
        '[conventional-private-properties]',
        'constructor',
        '[methods]',
        '[conventional-private-methods]',
      ],
    }],
  },

  /**
   * Webpack-literate module resolution plugin for eslint-plugin-import.
   * @see {@link https://www.npmjs.com/package/eslint-import-resolver-webpack}
   */
  settings: {
    'html/html-extensions': [
      '.erb',
      '.handlebars',
      '.hbs',
      '.htm',
      '.html',
      '.mustache',
      '.nunjucks',
      '.php',
      '.tag',
      '.twig',
      '.we',
    ],
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },

};
