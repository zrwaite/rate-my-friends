module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		indent: ["error", "tab", { "SwitchCase": 1 }],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{
				allowExpressions: true,
			},
		],
		'object-curly-spacing': ['error', 'always'],
		'@typescript-eslint/type-annotation-spacing': [
			'error',
			{
				before: false,
				after: true,
				overrides: {
					arrow: {
						before: true,
						after: true,
					},
				},
			},
		],
		'eol-last': ['error', 'always'],
		'react/react-in-jsx-scope': 'off'
	},
}
