'use strict';

/**
 * Module dependencies.
 */
var assert = require('chai').assert;
var mocks = require('./mocks/');
var htmlparser = require('htmlparser2');

/**
 * Helper that creates and runs tests based on mock data.
 *
 * @param {Function} parser  - The parser.
 * @param {Object}   mockObj - The mock object.
 */
function runTests(parser, mockObj) {
    Object.keys(mockObj).forEach(function(type) {
        it(type, function() {
            var data = mockObj[type];
            assert.deepEqual(parser(data), htmlparser.parseDOM(data));
        })
    });
}

/**
 * Helper that runs tests and confirms an error is thrown.
 *
 * @param {Function} parser - The parser.
 */
function throwTests(parser) {
    [undefined, null, 1, true, {}, [], Function].forEach(function(parameter) {
        it('throws error for invalid parameter: ' + parameter, function() {
            assert.throws(function() { parser(parameter); }, TypeError);
        });
    });
}

/**
 * Tests for parser.
 */
describe('html-dom-parser', function() {

    // server
    describe('server parser', function() {
        var parser = require('../');

        // check if invalid parameter type throws error
        throwTests(parser);

        // should be equivalent to `htmlparser2.parseDOM()`
        runTests(parser, mocks.html);
        runTests(parser, mocks.svg);
    });

    // client
    describe('client parser', function() {
        var parser = require('../lib/html-to-dom-client');
        var jsdomify = require('jsdomify').default;

        before(function() {
            jsdomify.create();
        });

        after(function() {
            jsdomify.destroy();
        });

        // check if invalid parameter type throws error
        throwTests(parser);

        // should return the same output as `htmlparser2.parseDOM()`
        runTests(parser, mocks.html);
        // svg does not work in jsdom
        // runTests(parser, mocks.svg);
    });

});