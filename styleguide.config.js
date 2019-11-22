const path = require("path");
const { readdirSync } = require("fs");

const dirTree = require("directory-tree");
const componentsTree = dirTree("docs", { extensions: /\.md$/ });

function iterate(tree) {
	return tree.map(child => ({
		name: !!child.extension
			? child.name.slice(0, -child.extension.length)
			: child.name,
		sections: !!child.children ? iterate(child.children) : undefined,
		content: !!child.children ? undefined : child.path
	}));
}
const sections = iterate(componentsTree.children);

module.exports = {
	require: [path.resolve(__dirname, "docs/setup.js")],
	components: "docs/components/**/*.{js,jsx,ts,tsx}",
	exampleMode: "expand",
	pagePerSection: true,
	skipComponentsWithoutExample: true,
	propsParser: require("react-docgen-typescript").withCustomConfig(
		"./tsconfig.json"
	).parse,
	webpackConfig: {
		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: ["ts", ".tsx"],
			alias: {
				"scroll-utility$": path.resolve(__dirname, "src/index.ts")
			}
		},
		module: {
			rules: [
				{
					test: /\.ts(x?)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "ts-loader"
						}
					]
				}
			]
		}
	},
	sections
};
