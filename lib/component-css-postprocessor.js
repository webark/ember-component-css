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
  var hashFn = this.inputTree['inputTree'] && this.inputTree['inputTree'].hashFn;

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
                             '    name = name.replace(".","/");\n' +
                             '    if (Component.prototype.classNames.indexOf(Ember.COMPONENT_CSS_LOOKUP[name]) > -1){\n' +
                             '      return Component;\n' +
                             '    }\n' +
                             '    return Component.reopen({\n' +
                             '      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]\n' +
                             '    });\n' +
                             '  },\n' +
                             '  componentFor: function(name, container) {\n' +
                             '    var Component = this._super(name, container);\n' +
                             '    if (!Component) { return; }\n' +
                             '    name = name.replace(".","/");\n' +
                             '    if (Component.prototype.classNames.indexOf(Ember.COMPONENT_CSS_LOOKUP[name]) > -1){\n' +
                             '      return Component;\n' +
                             '    }\n' +
                             '    return Component.reopen({\n' +
                             '      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]\n' +
                             '    });\n' +
                             '  }\n' +
                             '});\n';

    // Find the vendor.js file in assets so we can append the component lookup JS
    var assetFiles = fs.readdirSync(path.join(destDir, 'assets'));
    var vendorjs = assetFiles.filter(function(i){ return i.match(/vendor.*?\.js/); })[0];
    var vendorjsPath = path.join(destDir, 'assets', vendorjs);
    fs.appendFileSync(vendorjsPath, cssInjectionSource);

    if (hashFn && vendorjs.indexOf('-') > -1){
      var vendorJsContent = fs.readFileSync(vendorjsPath, { encoding: 'utf8' });
      var hash = hashFn(vendorJsContent);
      var newFileName = 'vendor-' + hash + '.js';

      fs.renameSync(vendorjsPath, vendorjsPath.replace(vendorjs, newFileName));

      var indexHtmlName = path.join(destDir, 'index.html');
      var indexHtmlContent = fs.readFileSync(indexHtmlName, { encoding: 'utf8' });
      indexHtmlContent = indexHtmlContent.replace(vendorjs, newFileName);
      fs.writeFileSync(indexHtmlName, indexHtmlContent);
    }

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
