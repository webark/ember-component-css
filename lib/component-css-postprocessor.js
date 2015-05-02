/* jshint node: true */
'use strict';

var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var symlinkOrCopy = require('symlink-or-copy');

function ComponentCssPostprocessor(inputTree, options) {
  this.inputTree = inputTree;
  this.options = options;
}

ComponentCssPostprocessor.prototype = Object.create(Writer.prototype);

ComponentCssPostprocessor.prototype.constructor = ComponentCssPostprocessor;

ComponentCssPostprocessor.prototype.write = function (readTree, destDir) {
  var pod = this.options.addon.pod;

  return readTree(this.inputTree).then(function(srcDir) {
    var paths = walkSync(srcDir);
    var currentPath;

    for (var i = 0, l = paths.length; i < l; i++) {
      currentPath = paths[i];

      if (currentPath[currentPath.length-1] === '/') {
        fs.mkdirSync(path.join(destDir, currentPath));
      } else {
        symlinkOrCopy.sync(path.join(srcDir, currentPath), path.join(destDir, currentPath));
      }
    }

    var cssInjectionSource = '\n\nEmber.COMPONENT_CSS_LOOKUP = ' + JSON.stringify(pod.lookup) + ';\n' +
                             'Ember.ComponentLookup.reopen({\n' +
                             '  lookupFactory: function(name, container) {\n' +
                             '    var Component = this._super(name, container);\n' +
                             '    if (!Component) { return; }\n' +
                             '    return Component.reopen({\n' +
                             '      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]\n' +
                             '    });\n' +
                             '  }\n' +
                             '});\n';

    // Find the vendor.js file in assets so we can append the component lookup JS
    var assetFiles = fs.readdirSync(path.join(destDir, 'assets'));
    var vendorjs = assetFiles.filter(function(i){ return i.match(/vendor.*?\.js/) })[0];
    fs.appendFileSync(path.join(destDir, 'assets', vendorjs), cssInjectionSource);
    
    // Only if we generated a pod-styles.css file do we need to append to vendor.css
    if (pod.extension === 'css') {
      fs.appendFileSync(path.join(destDir, 'assets', 'vendor.css'), pod.styles);
    }

    // Reset the pod for rebuild
    pod = {
      lookup: Object.create(null),
      styles: '',
      extension: ''
    };
  });
};

module.exports = ComponentCssPostprocessor;
