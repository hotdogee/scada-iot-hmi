module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },

  env: {
    browser: true,
    es6: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // "prettier", "prettier/standard",
    // 'plugin:vue/essential',
    'plugin:vue/recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    '@vue/standard'
    // 'plugin:prettier/recommended',
    // 'prettier-standard'
  ],

  // required to lint *.vue files
  plugins: ['vue', 'import'],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },

  // add your custom rules here
  rules: {
    'quote-props': ['error', 'as-needed'],
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    // import
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // vue
    'vue/html-self-closing': 'off',
    'vue/name-property-casing': 'off',
    'vue/attribute-hyphenation': 'off'
  }
}
