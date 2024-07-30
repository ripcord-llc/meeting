import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";

import pkj from "./package.json" assert { type: "json" };

const plugins = [
  replace({
    "process.env.NODE_ENV":
      process.env.NODE_ENV === "production"
        ? JSON.stringify("production")
        : JSON.stringify("development"),
    preventAssignment: true,
  }),
  nodeResolve({ extensions: [".ts", ".tsx"] }),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  }),
  typescript({ noForceEmit: true }),
];

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        file: pkj.browser,
        format: "iife",
        name: "Ripcord",
      },
    ],
    plugins,
  },
  {
    input: "src/index.tsx",
    output: [
      {
        file: pkj.module,
        format: "es",
      },
      {
        file: pkj.main,
        format: "cjs",
      },
    ],
    plugins,
  },
];
