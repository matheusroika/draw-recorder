import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin: typeof CopyWebpackPlugin = require('copy-webpack-plugin')

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyPlugin({
    patterns: [
      { from: 'iohook', to: 'builds'},
      { from: 'iohook', to: path.resolve(__dirname, 'node_modules', '@mechakeys', 'iohook', 'builds')}
    ]
  })
];
