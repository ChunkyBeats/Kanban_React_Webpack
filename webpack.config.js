const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
  // Entry accepts a path or an object of entries
  entry:  {
    app: PATHS.app
  },

  // Add resolve.extensions.
  // '' is needed to allow imports without an extension
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    preloaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        // Test expects a RegEx! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,

        // Enable caching for improved performance in development
        // Uses default OS directory by default, to customize:
        // babel?cacheDirectory=<path>
        loaders: ['babel?cacheDirectory'],

        // Parse only app files! Without, will go through entire project
        include: PATHS.app
      }
    ]
  }
};

// Default Configuration
if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devTool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallbacks so HTML5 History API based
      // routing works.  This is a good default that will come in handy
      // in more complicated setups
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}
