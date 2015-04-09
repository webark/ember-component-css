/* jshint node: true */
'use strict';

var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var symlinkOrCopy = require('symlink-or-copy');

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

module.exports = ComponentCssPostprocessor;
