/* jshint node: true */
'use strict';

var expect = require('expect.js');

var ComponentCssPreprocessor = require('../../lib/component-css-preprocessor');

describe('component-css-preprocessor', function(){
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
