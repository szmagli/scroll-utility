const path = require("path");
const { readdirSync } = require("fs");

const sections = readdirSync(path.resolve(__dirname, "docs/components")).filter((file) => file !== "globals.tsx").map(
	file => ({
		name: file.slice(0, -3),
		content: `./docs/components/${file}`
	})
);

module.exports = {
	require: [path.resolve(__dirname, "styleguide/setup.js")],
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
