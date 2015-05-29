/* jshint node: true */
'use strict';

var path = require('path');
var expect = require('expect.js');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var ComponentCssPreprocessor = require('../../lib/component-css-preprocessor');

describe('component-css-preprocessor', function(){
  var cssFixturePath = path.join(__dirname, 'css_fixtures');
  var scssFixturePath = path.join(__dirname, 'scss_fixtures');
  var addon = {
    podDir: function() {
      return null;
    },
    pod: {
      lookup: Object.create(null)
    }
  };

  describe('constructor', function() {
    it('is named component-css and acquires the passed in options', function() {
      var plugin = new ComponentCssPreprocessor({ addon: addon });

      expect(plugin.name).to.eql('component-css');
      expect(plugin.options).to.eql({ addon: addon });
    });
  });
});
