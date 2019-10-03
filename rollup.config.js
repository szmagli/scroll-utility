import typescript from "rollup-plugin-typescript"
import html from "rollup-plugin-bundle-html"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import serve from "rollup-plugin-serve"
import pkg from "./package.json"

export default args => {
	return [
		{
			input: "doc/index.ts",
			output: {
				file: 'doc/index.js',
				format: "iife",
			},
			plugins: [typescript(),],
		},
		{
			input: "src/index.ts",
			output: {
				name: "ScrollUtility",
				file: 'doc/bundle.js',
				format: "umd",
			},
			plugins: [
				commonjs(),
				resolve(),
				typescript(),
				serve({
					open: true,
					verbose: true,
					contentBase: "doc",
				}),
			],
		}
	];
}
