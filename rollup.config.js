import typescript from "@rollup/plugin-typescript";

export default () => {
	return [
		{
			input: "src/index.ts",
			output: [
				{
					name: "ScrollUtility",
					file: "dist/scroll-utility.umd.js",
					format: "umd"
				},
				{
					name: "ScrollUtility",
					file: "dist/scroll-utility.iife.js",
					format: "iife"
				},
				{
					name: "ScrollUtility",
					file: "dist/scroll-utility.amd.js",
					format: "amd"
				}
			],
			plugins: [typescript()]
		}
	];
};
