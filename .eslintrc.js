// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        "browser": true,
        "node": true,
        "commonjs": true
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'airbnb',
    // required to lint *.vue files
    plugins: [
        'react',
        'html'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'linebreak-style': 0,
        "classes": true,
        "jsx-a11y/aria-role": 0,
        "jsx-a11y/aria-props": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/role-supports-aria-props": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "max-len": ["error", 120],
        "no-plusplus": 0
    }
}
