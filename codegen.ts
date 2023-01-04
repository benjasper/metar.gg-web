import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	schema: 'https://api.metar.gg/graphql',
	documents: 'src/**/*.tsx',
	generates: {
		'src/queries/generated/graphql.ts': {
			plugins: ['typescript', 'typescript-operations', 'fragment-matcher'],
		},
		'./graphql.schema.json': {
			plugins: ['introspection'],
		},
	},
	hooks: {
		afterOneFileWrite: [
			'prettier --write src/queries/generated/graphql.ts',
			'eslint --fix src/queries/generated/graphql.ts',
		],
	},
}
export default config
