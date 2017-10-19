const webpack = require('webpack');
const fs = require('fs');
const isDev = require('isdev');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appPath = require('../config/app-path');
const pkg = require('../package');
const babel = JSON.parse(fs.readFileSync('./.babelrc'));

const clientConfig = {
  name: 'client',
  target: 'web',
  context: appPath.src,
  entry: [`${appPath.src}/client/index.js`],
  output: {
    publicPath: '/dist/',
    path: `${appPath.public}/dist`,
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [['env', { modules: false }], 'react', 'stage-2'],
            plugins: isDev
              ? babel.plugins.concat(['react-hot-loader/babel'])
              : babel.plugins
          }
        }
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true, // enable css modules
                localIdentName: pkg.cssModules.scopedName,
                sourceMap: !!isDev
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: !!isDev }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !!isDev,
                plugins: () => [autoprefixer]
              }
            }
          ]
        })
      },
      {
        test: /\.(eot|ttf|woff2?)(\?.*)?$/i,
        use: isDev
          ? 'url-loader?name=fonts/[name].[ext]'
          : 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(svg|png|jpe?g|gif)(\?.*)?$/i,
        use: isDev
          ? 'url-loader?name=images/[name].[ext]'
          : 'file-loader?name=images/[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':
        JSON.stringify(process.env.NODE_ENV) || 'development'
    }),
    new ExtractTextPlugin({
      filename: 'css/screen.css',
      ignoreOrder: true,
      allChunks: true
    }),
    new CopyWebpackPlugin([
      {
        from: `${appPath.src}/assets/icons`,
        to: `${appPath.public}/dist/icons`
      }
    ])
    // new HtmlWebpackPlugin({
    //   template: `!!raw-loader!${appPath.src}/assets/views/template.ejs`,
    //   filename: `${appPath.public}/index.ejs`,
    //   minify: {
    //     collapseWhitespace: !isDev,
    //     removeComments: !isDev
    //   }
    // })
  ]
};

if (isDev) {
  clientConfig.devtool = 'cheap-module-eval-source-map';
  clientConfig.entry.unshift(
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    'webpack/hot/only-dev-server'
  );
  clientConfig.plugins.unshift(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );
} else {
  clientConfig.devtool = 'source-map';
  clientConfig.plugins = clientConfig.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      sourceMap: true,
      minimize: true,
      output: { comments: false },
      mangle: { screw_ie8: true },
      compress: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]);
}

module.exports = clientConfig;
