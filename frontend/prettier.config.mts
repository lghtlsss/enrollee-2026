import { type Config as PrettierConfig } from 'prettier';
import { type PluginOptions as TailwindcssPluginOptions } from 'prettier-plugin-tailwindcss';

type Config = PrettierConfig & TailwindcssPluginOptions;

const config: Config = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  bracketSpacing: true,
  trailingComma: 'all',
  printWidth: 100,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  bracketSameLine: true,
  tailwindStylesheet: './src/app/globals.css',
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
};

export default config;
