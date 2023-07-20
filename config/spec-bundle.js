Error.stackTraceLimit = Infinity;

require('core-js/features/reflect');

// Typescript emit helpers polyfill
require('ts-helpers');
require('./testing-utils');

require('zone.js');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

let testing = require('@angular/core/testing');
let browser = require('@angular/platform-browser-dynamic/testing');

testing.getTestBed().initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('../tests', true, /\.spec\.ts$/);
// And load the modules.
const modules = context.keys().map(context);
