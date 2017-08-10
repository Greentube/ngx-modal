var testWebpackConfig = require('./webpack.test.js');

module.exports = function (config) {

  var configuration = {
    basePath: '',

    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-webpack'),
      require('karma-remap-coverage'),
      require('karma-mocha-reporter')
    ],

    // list of files to exclude
    exclude: [],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [{pattern: './config/spec-bundle.js', watched: false}],

    preprocessors: {'./config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap']},

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },

    reporters: ['mocha', 'coverage', 'remap-coverage'],

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    },

    mochaReporter: {
      ignoreSkipped: true
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: { noInfo: true },

    // web server port
    port: 9876,

    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: [ 'ChromeHeadless' ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    singleRun: true
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
    configuration.reporters = ['mocha'];
  }

  config.set(configuration);
};
