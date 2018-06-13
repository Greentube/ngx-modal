/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

/*
 Temporary file for referencing the TypeScript defs for Jasmine + some potentially
 utils for testing. Will change/adjust this once I find a better way of doing
 */

beforeEach(() => {
  jasmine.addMatchers({

    toHaveText: function() {
      return {
        compare: function(actual: any, expectedText: any) {
          var actualText = actual.textContent;
          return {
            pass: actualText === expectedText,
            get message() {
              return 'Expected ' + actualText + ' to equal ' + expectedText;
            }
          };
        }
      };
    },

    toContainText: function() {
      return {
        compare: function(actual: any, expectedText: any) {
          var actualText = actual.textContent;
          return {
            pass: actualText.indexOf(expectedText) > -1,
            get message() {
              return 'Expected ' + actualText + ' to contain ' + expectedText;
            }
          };
        }
      };
    },

    toBeAnInstanceOf: function () {
      return {
        compare: function (actual: any, expectedClass: any) {
          const pass = typeof actual === 'object' && actual instanceof expectedClass;
          return {
            pass: pass,
            get message() {
              return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
            }
          };
        }
      };
    },
  });
});
