// https://eslint.org/docs/user-guide/configuring
const JSDOC_LEVEL = 1
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    node: true,
    jquery: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // 基本的eslint
    // 'plugin:vue/essential', 
    // 'plugin:vue/recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 'standard',
    // 'plugin:vue/essential',
    'airbnb-base'
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'filenames',
    // 'object-literal-jsdoc',
    'vue',
    'jsdoc'
  ],
  // add your custom rules here
  rules: {
    'valid-jsdoc': [JSDOC_LEVEL, {
      requireReturn: false,
    }],
    'require-jsdoc': [JSDOC_LEVEL, {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    }],
    'jsdoc/check-param-names': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/no-undefined-types': 1,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
    // 不允许驼峰式命名
    // 'filenames/match-regex': [1, '^[0-9a-z-.]+$', true],
    'no-reserved-keys': [0],
    'no-debugger': [1],
    'no-alert': [1],
    'semi': [2, 'never'],
    'no-console': [1],
    'prefer-const': [1],
    'eol-last': [1],
    'object-shorthand': [1],
    'no-param-reassign': [0],
    'func-names': [0],
    'no-shadow': [1],
    'arrow-body-style': [0],
    'comma-dangle': [1],
    'space-before-function-paren': [1],
    'prefer-template': [1],
    'no-new': [0],
    'consistent-return': [1],
    'quote-props': [1],
    'array-bracket-spacing': [1],
    'no-unused-vars': [1, { argsIgnorePattern: '^h|context$' }],
    'computed-property-spacing': [1],
    'max-len': [1],
    'import/no-extraneous-dependencies': [0],
    'global-require': [0],
    'arrow-parens': [0],
    'linebreak-style': [0],
    'no-plusplus': [0],
    'no-underscore-dangle': [0],
    'new-cap': [1],
    'no-restricted-syntax': [0],
    'class-methods-use-this': [0],
    'import/no-unresolved': [0],
    'import/prefer-default-export': [0],
    'import/no-dynamic-require': [0],
    'import/imports-first': [0],
    'import/newline-after-import': [1],
    'import/extensions': [0],
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        param: 'param',
        returns: 'return',
      },
    }
  }
}
