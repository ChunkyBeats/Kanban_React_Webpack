const path = require('path');
const merge = require('webpack-merge');
const TARGET = process.env.npm_lifecycle_event;
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        // Test expects a RegEx! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths
        include: PATHS.app
      }
    ]
  }
};

// Default Configuration
if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
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
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}
