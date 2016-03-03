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
  var isHashed = function(fileName) {
    return hashFn && fileName.indexOf('-') > -1
  };

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
    var vendorjs = getVendorFile(assetFiles, 'js');
    var vendorjsPath = path.join(destDir, 'assets', vendorjs);
    // FIXME: This is a quick and ugly workaround to fix #114
    if (fs.readFileSync(vendorjsPath).toString().indexOf('Ember.COMPONENT_CSS_LOOKUP') === -1) {
      fs.appendFileSync(vendorjsPath, cssInjectionSource);
    }

    if (isHashed(vendorjs)) {
      var newJsFileName = rehash(hashFn, destDir, vendorjs)
      rewriteIndex(destDir, vendorjs, newJsFileName);
    }

    // Only if we generated a pod-styles.css file do we need to append to vendor.css
    if (pod.extension === 'css') {
      var vendorcss = getVendorFile(assetFiles, 'css');
      var vendorcssPath = path.join(destDir, 'assets', vendorcss);
      fs.appendFileSync(vendorcssPath, pod.styles);

      if (isHashed(vendorcss)) {
        var newCssFileName = rehash(hashFn, destDir, vendorcss);
        rewriteIndex(destDir, vendorjs, newCssFileName);
      }
    }

    // Reset the pod for rebuild
    pod = {
      lookup: Object.create(null),
      styles: '',
      extension: ''
    };
  });
};

function getVendorFile(assets, ext) {
  var r = new RegExp('vendor.*?\.' + ext)
  return assets.filter(function(a) {
    return r.test(a);
  })[0];
}

function rewriteIndex(destDir, oldFileName, newFileName) {
  var indexHtmlName = path.join(destDir, 'index.html');
  var indexHtmlContent = fs.readFileSync(indexHtmlName, { encoding: 'utf8' });
  indexHtmlContent = indexHtmlContent.replace(oldFileName, newFileName);
  fs.writeFileSync(indexHtmlName, indexHtmlContent);
}

function rehash(hashFn, destDir, fileName) {
  var ext         = fileName.split('.').slice(-1)[0];
  var oldFilePath = path.join(destDir, 'assets', fileName);
  var content     = fs.readFileSync(oldFilePath, { encoding: 'utf8' });
  var hash        = hashFn(content);
  var newFileName = file + '-' + hash + '.' + ext;

  fs.renameSync(oldFilePath, oldFilePath.replace(fileName, newFileName))

  return newFileName
}

module.exports = ComponentCssPostprocessor;
