module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'plugin:ember-suave/recommended'
  ],
  env: {
    'browser': true
  },
  rules: {
    "comma-dangle": "off",
    "ember-suave/no-direct-property-access": "warn"
  }
};
