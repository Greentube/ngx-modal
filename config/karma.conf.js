module.exports = function (config) {
  const testWebpackConfig = require('./webpack.test.js');
  const configuration = {
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
    exclude: [],

    files: [{ pattern: './config/spec-bundle.js', watched: false }],

    preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

    webpack: testWebpackConfig,

    webpackMiddleware: {
      logLevel: 'warn',
      stats: {
        chunks: false
      }
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
    webpackServer: { noInfo: true },
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: [ 'ChromeHeadless' ],

    customLaunchers: {
      ChromeTravisCi: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: true
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['ChromeTravisCi'];
    configuration.reporters = ['mocha'];
  }

  config.set(configuration);
};
