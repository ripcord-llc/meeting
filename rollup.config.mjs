import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

import pkj from "./package.json" assert { type: "json" };

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
    plugins: [
      replace({
        "process.env.NODE_ENV":
          process.env.NODE_ENV === "production"
            ? JSON.stringify("production")
            : JSON.stringify("development"),
        preventAssignment: true,
      }),
      nodeResolve({ extensions: [".ts", ".tsx"] }),
      commonjs(),
      typescript(),
    ],
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
    plugins: [
      replace({
        "process.env.NODE_ENV":
          process.env.NODE_ENV === "production"
            ? JSON.stringify("production")
            : JSON.stringify("development"),
        preventAssignment: true,
      }),
      nodeResolve({ extensions: [".ts", ".tsx"] }),
      commonjs(),
      typescript(),
    ],
  },
];
