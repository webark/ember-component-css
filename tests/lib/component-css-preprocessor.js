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
      return null
    },
    pod: {
      lookup: Object.create(null)
    }
  };
  var treeBuilder;

  afterEach(function() {
    if (treeBuilder) {
      return treeBuilder.cleanup();
    }
  })

  describe('constructor', function() {
    it('is named component-css and acquires the passed in options', function() {
      var plugin = new ComponentCssPreprocessor({ addon: addon });

      expect(plugin.name).to.eql('component-css');
      expect(plugin.options).to.eql({ addon: addon });
    });
  });

  describe('toTree', function() {
    it('returns the styles directory + pod-styles.css', function() {
      var stylesPath = 'app/styles';
      var tree = new ComponentCssPreprocessor({
        addon: addon
      }).toTree(cssFixturePath, stylesPath);

      treeBuilder = new broccoli.Builder(tree);

      return treeBuilder.build().then(function(results) {
        var actual = walkSync(results.directory);
        var expected = ['app/', 'app/styles/', 'app/styles/app.css', 'pod-styles.css'];

        expect(actual).to.eql(expected);
      });
    });

    it('returns the styles directory + pod-styles.scss', function() {
      var stylesPath = 'app/styles';
      var tree = new ComponentCssPreprocessor({
        addon: addon
      }).toTree(scssFixturePath, stylesPath);

      treeBuilder = new broccoli.Builder(tree);

      return treeBuilder.build().then(function(results) {
        var actual = walkSync(results.directory);
        var expected = ['app/', 'app/styles/', 'app/styles/app.scss', 'pod-styles.scss'];

        expect(actual).to.eql(expected);
      });
    });
  });
});
