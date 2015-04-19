/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
// var RSVP = require('rsvp');
var expect = require('expect.js');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
// var rimraf = RSVP.denodeify(require('rimraf'));

var ComponentCssPreprocessor = require('../../lib/component-css-preprocessor');

describe('component-css-preprocessor', function(){
  var fixturePath = path.join(__dirname, 'fixtures');
  var addon = {
    podDir: function() {
      return null
    },
    pod: {}
  };
  var treeBuilder;

  afterEach(function() {
    if (treeBuilder) {
      return treeBuilder.cleanup();
    }
  })


  describe('toTree', function() {
    it('returns the styles directory + pod-styles', function() {
      var tree = new ComponentCssPreprocessor({addon: addon}).toTree(fixturePath);

      treeBuilder = new broccoli.Builder(tree);

      return treeBuilder.build().then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.eql(walkSync(fixturePath));
      });
    });
  });
});