module.exports = {
  "root": true,
  "env": {
    "node": true,
    es6: true,
		browser: true,
  },
  extends: [
    // "plugin:vue/essential",
    // "plugin:prettier/recommended",
    // "eslint:recommended"
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended"
  ],
  plugins: [
		'vue',
		'prettier',
	],
  rules: {
    // "semi": "error",
    // "no-extra-semi": "warn",
    // "quotes": ["error", "single", { "allowTemplateLiterals": true } ],
    // "eqeqeq": "error",
    // "indent": ["warn", "tab", { "SwitchCase": 1 } ],
    "max-len": ["error", { "code": 80 }],
  },
  parserOptions: {
    "ecmaVersion": 6,
    "parser": "babel-eslint",

  }
}