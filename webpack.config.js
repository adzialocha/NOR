const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const pkg = require('./package.json');

function getPath(filePath) {
  return path.resolve(__dirname, filePath);
}

const ASSETS_NAME = 'app';
const ASSETS_PATH = getPath('src');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    entry: getPath(`${ASSETS_PATH}/scripts/index.js`),
    output: {
      filename: `${ASSETS_NAME}.js`,
      path: getPath('./dist'),
    },
    resolve: {
      modules: [
        ASSETS_PATH,
        'node_modules',
      ],
      alias: {
        'osc-js': getPath('./node_modules/osc-js/lib/osc.browser.js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                indentedSyntax: false,
                includePaths: [
                  ASSETS_PATH,
                ],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${ASSETS_PATH}/index.html`,
        minify: {
          collapseWhitespace: isProduction,
        },
      }),
      new WebpackPwaManifest({
        name: pkg.name,
        short_name: pkg.name,
        description: pkg.description,
        background_color: '#000000',
        icons: [
          {
            src: getPath(`${ASSETS_PATH}/images/icon.png`),
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: `${ASSETS_NAME}.css`,
      }),
    ],
    devtool: isProduction ? false : 'source-map',
  };
};
