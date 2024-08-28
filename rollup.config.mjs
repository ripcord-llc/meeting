import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';

import pkj from './package.json' assert { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  replace({
    'process.env.NODE_ENV': isProduction
      ? JSON.stringify('production')
      : JSON.stringify('development'),
    preventAssignment: true,
  }),
  nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }), // Transpiles JSX and TS
  postcss({
    plugins: [],
  }),
];

const devPlugins = [...(isProduction ? [] : [filesize()])];

const common = {
  onwarn: (warning, defaultHandler) => {
    if (
      warning.message.includes(`Module level directives cause errors when bundled, "use client" in`)
    )
      return;

    defaultHandler(warning);
  },
};

export default [
  {
    ...common,
    plugins: [...plugins, ...devPlugins],
    input: 'src/browser.ts',
    output: [
      {
        file: pkj.browser,
        format: 'iife',
        name: 'Ripcord',
      },
      {
        file: pkj.browser.replace('.js', '.min.js'),
        format: 'iife',
        name: 'Ripcord',
        plugins: [terser()],
      },
    ],
  },
  {
    ...common,
    input: 'src/index.tsx',
    plugins: [
      ...plugins,
      typescript({ noForceEmit: true }), // Only for type checking and declaration file generation
      ...devPlugins,
    ],
    external: [
      '@emotion/react',
      '@emotion/styled',
      '@hookform/resolvers',
      '@mui/icons-material',
      '@mui/lab',
      '@mui/material',
      '@mui/x-date-pickers',
      'dayjs',
      'lodash',
      'react',
      'react-dom',
      'react-hook-form',
      'react-phone-number-input',
      'swr',
      'validator',
      'yup',
    ],
    output: [
      {
        file: pkj.module,
        format: 'es',
      },
      {
        file: pkj.main,
        format: 'cjs',
      },
    ],
  },
  // For types. Merges d.ts files into a single file.
  {
    input: './dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      replace({
        "import './index.css';": '',
        preventAssignment: false,
        delimiters: ['', ''],
      }), // For some reason, the css imports are included in the d.ts files. This removes them.
      dts(),
      del({ targets: 'dist/types', hook: 'buildEnd' }), // Deletes the types folder after the build
    ],
  },
];
