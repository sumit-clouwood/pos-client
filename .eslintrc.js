module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: [
    // "plugin:vue/essential",
    // "plugin:prettier/recommended",
    // "eslint:recommended"
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    'eslint:recommended',
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    // "semi": "error",
    // "no-extra-semi": "warn",
    // "quotes": ["error", "single", { "allowTemplateLiterals": true } ],
    // "eqeqeq": "error",
    // "indent": ["warn", "tab", { "SwitchCase": 1 } ],
    'max-len': [
      'error',
      {
        code: 80,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreComments: true,
        ignorePattern:
          "d=|src=|class=|href=|points=|<!--|<!--\\n\\r|'|let\\s.+=\\s/",
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 6,
    parser: 'babel-eslint',
  },
}
