import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import terser from '@rollup/plugin-terser';

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
  // typescript({ noForceEmit: true }), // Only for type checking and declaration file generation
  postcss({
    plugins: [],
  }),
  ...(isProduction ? [] : [filesize()]),
];

const common = {
  plugins,
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
];
