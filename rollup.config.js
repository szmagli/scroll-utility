import typescript from "@rollup/plugin-typescript";

export default () => {
	return [
		{
			input: "src/index.ts",
			output: {
				name: "ScrollUtility",
				file: "dist/scroll-utility.js",
				format: "umd"
			},
			plugins: [typescript()]
		}
	];
};
