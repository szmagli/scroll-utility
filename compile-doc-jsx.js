const ts = require("typescript")
const transformJsx = require("typescript-transform-jsx").default;
const { writeFileSync } = require("fs");
const { resolve } = require("path");

const compilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.Preserve
};

function compile(file, options) {
  let content = "";
  const program = ts.createProgram([file], options);
  program.emit(
    undefined,
    (_, result) => (content = result),
    undefined,
    undefined,
    {
      after: [transformJsx(program)]
    }
  );
  return content;
}

const result = compile(resolve(__dirname, "doc/index.tsx"), {});
const tsx = eval(result)(["index.js","bundle.js"]);

writeFileSync(resolve(__dirname, "doc/index.html"), tsx);
