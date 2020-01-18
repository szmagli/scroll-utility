import typescript from "@rollup/plugin-typescript";

export default () => {
	return [
		{
			input: "src/index.ts",
			output: [
				{
					name: "ScrollUtility",
					file: "dist/scroll-utility.iife.js",
					format: "iife"
				},
				{
					file: "dist/scroll-utility.cjs.js",
					format: "cjs"
				},
				{
					file: "dist/scroll-utility.esm.js",
					format: "esm"
				}
			],
			plugins: [typescript()]
		}
	];
};
