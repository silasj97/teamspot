"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script"
  },
  env: {
    es6: true,
    node: true
  },
  plugins: ["import", "promise"],
  extends: [
    "eslint:recommended",
    "plugin:promise/recommended",
    "plugin:import/recommended"
  ],
  rules: {
    "no-console": "off",

    "class-methods-use-this": "warn",
    "no-extend-native": "warn",
    "no-self-compare": "warn",
    "no-throw-literal": "warn",
    "prefer-promise-reject-errors": "warn",
    "require-await": "warn",
    "global-require": "warn",
    "handle-callback-err": "warn",
    "no-mixed-requires": "warn",
    "no-path-concat": "warn",
    "consistent-this": "warn",
    "max-depth": "warn",
    "max-nested-callbacks": "warn",
    "no-lonely-if": "warn",
    "no-unneeded-ternary": "warn",
    "no-duplicate-imports": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-constructor": "warn",
    "no-useless-rename": "warn",
    "symbol-description": "warn",
    "promise/no-return-in-finally": "warn",
    "promise/always-return": "warn",

    "no-template-curly-in-string": "error",
    "accessor-pairs": "error",
    "array-callback-return": "error",
    eqeqeq: "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-new-wrappers": "error",
    "no-sequences": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": "error",
    "no-void": "error",
    "no-with": "error",
    radix: "error",
    strict: "error",
    "no-label-var": "error",
    "no-new-require": "error",
    "no-sync": "error",
    camelcase: "error",
    "no-confusing-arrow": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-numeric-literals": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "no-unused-vars": ["error", { args: "none" }],
    "promise/valid-params": "error",
    "import/no-extraneous-dependencies": "error"
  },
  overrides: [
    {
      files: "**/*.test.js",
      env: { jest: true },
      rules: { "no-console": "error" }
    }
  ]
};
