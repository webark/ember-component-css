/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var symlinkOrCopy = require('symlink-or-copy');
var css = require('css');

var guid = function fn (n) {
  return n ?
           (n ^ Math.random() * 16 >> n/4).toString(16) :
           ('10000000'.replace(/[018]/g, fn));
};

function BrocComponentCssPreprocessor(inputTree) {
  this.inputTree = inputTree;
}

BrocComponentCssPreprocessor.prototype = Object.create(Writer.prototype);
BrocComponentCssPreprocessor.prototype.constructor = BrocComponentCssPreprocessor;

var CSS_SUFFIX = /\.css$/;

var podLookup = Object.create(null);

var HAS_AMPERSAND = /&/;

function transformCSS(podGuid, parsedCss) {
  var rules = parsedCss.stylesheet.rules;

  rules.forEach(function(rule) {
    rule.selectors = rule.selectors.map(function(selector) {
      if (HAS_AMPERSAND.test(selector)) {
        return selector.replace('&', '.' + podGuid);
      } else {
        return '.' + podGuid + " " + selector;
      }
    });
  });

  return parsedCss;
}

BrocComponentCssPreprocessor.prototype.write = function (readTree, destDir) {
  return readTree(this.inputTree).then(function(srcDir) {
    var buffer = [];
    var paths = walkSync(srcDir);
    var filepath;
    for (var i = 0, l = paths.length; i < l; i++) {
      filepath = paths[i];
      if (!CSS_SUFFIX.test(filepath)) { continue; }
      var podName = filepath.split('/')[0];
      var podGuid = podName + '-' + guid();
      var cssFileContents = fs.readFileSync(path.join(srcDir, filepath)).toString();
      var parsedCss = css.parse(cssFileContents);
      var transformedParsedCSS = transformCSS(podGuid, parsedCss);
      buffer.push(css.stringify(transformedParsedCSS));
      podLookup[podName] = podGuid;
    }

    fs.writeFileSync(path.join(destDir, 'pod-styles.css'), buffer.join(''));
    fs.writeFileSync(path.join(destDir, 'pod-lookup.json'), JSON.stringify(podLookup));
  });
};

function ComponentCssPostprocessor(inputTree) {
  this.inputTree = inputTree;
}

ComponentCssPostprocessor.prototype = Object.create(Writer.prototype);
ComponentCssPostprocessor.prototype.constructor = ComponentCssPostprocessor;

ComponentCssPostprocessor.prototype.write = function (readTree, destDir) {
  return readTree(this.inputTree).then(function(srcDir) {
    var paths = walkSync(srcDir);
    var currentPath;
    var cssInjectionSource;
    for (var i = 0, l = paths.length; i < l; i++) {
      currentPath = paths[i];
      if (currentPath === "pod-lookup.json") {
        var podLookupFilepath = path.join(srcDir, "pod-lookup.json");
        var podLookup = fs.readFileSync(podLookupFilepath);
        cssInjectionSource = "\n\nEmber.COMPONENT_CSS_LOOKUP = " + podLookup + ";\n";
        cssInjectionSource += "Ember.ComponentLookup.reopen({\n" +
          "  lookupFactory: function(name, container) {\n" +
          "    var Component = this._super(name, container);\n" +
          "    if (!Component) { return; }\n" +
          "    return Component.reopen({\n" +
          "      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]\n" +
          "    });\n" +
          "  }\n" +
          "});\n";
      } else {
        if (currentPath[currentPath.length-1] === '/') {
          fs.mkdirSync(path.join(destDir, currentPath));
        } else {
          symlinkOrCopy.sync(path.join(srcDir, currentPath), path.join(destDir, currentPath));
        }
      }
    }

    fs.appendFileSync(path.join(destDir, "assets", "vendor.js"), cssInjectionSource);
    fs.appendFileSync(path.join(destDir, "assets", "vendor.css"), fs.readFileSync(path.join(srcDir, 'pod-styles.css')));
  });
};

function ComponentCSSPreprocessor(options) {
  this.name = 'component-css';
  this.options = options || {};
}

ComponentCSSPreprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
  var filteredTree = new Funnel(tree, {
    srcDir: 'app',
    exclude: [/^styles/]
  });
  return new BrocComponentCssPreprocessor(filteredTree);
};

module.exports = {
  name: 'ember-component-css',

  included: function(app) {
    this.app = app;
    var plugin = new ComponentCSSPreprocessor();
    this.app.registry.add('css', plugin);
  },

  postprocessTree: function(type, workingTree) {
    if (type === 'all') {
      return new ComponentCssPostprocessor(workingTree);
    }
    return workingTree;
  }
};
