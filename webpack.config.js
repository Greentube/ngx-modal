const helpers = require('./config/helpers');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = {
  devtool: '#source-map',

  resolve: {
    extensions: ['.ts', '.js', '.css', '.scss', '.html']
  },

  entry: helpers.root('index.ts'),

  output: {
    path: helpers.root('bundles'),
    publicPath: '/',
    filename: 'ngx-modal.umd.js',
    libraryTarget: 'umd',
    library: 'ngx-modal'
  },

  // require those dependencies but don't bundle them
  externals: [/^\@angular\//, /^rxjs\//],
  target: 'node',

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        options: {
          declaration: false
        },
        exclude: [/\.spec\.ts$/, helpers.root('node_modules')]
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader'
      }
    ]
  },

  plugins: [
    // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src')
    ),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslintLoader: {
          emitErrors: true,
          failOnHint: true
        }
      }
    }),
    new CleanWebpackPlugin(['bundles'], {
      root: helpers.root(),
      verbose: false,
      dry: false
    })
  ]
};
