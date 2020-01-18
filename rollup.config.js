import typescript from "@rollup/plugin-typescript";

function build({ input, name, file }) {
	return {
		input,
		output: [
			{
				name,
				file: `dist/${file}.iife.js`,
				format: "iife"
			},
			{
				file: `dist/${file}.cjs.js`,
				format: "cjs"
			},
			{
				file: `dist/${file}.esm.js`,
				format: "esm"
			}
		],
		plugins: [typescript()]
	};
}

export default () => {
	return [
		build({
			input: "src/index.ts",
			name: "ScrollUtility",
			file: "scroll-utility"
		}),
		build({
			input: "src/easings.ts",
			name: "ScrollUtilityEasings",
			file: "scroll-utility-easings"
		})
	];
};
