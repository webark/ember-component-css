/* jshint node: true */
'use strict';

var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var path = require('path');
var css = require('css');
var fs = require('fs');

var HAS_SELF_SELECTOR = /&|:--component/;

var guid = function fn(n) {
  return n ?
           (n ^ Math.random() * 16 >> n/4).toString(16) :
           ('10000000'.replace(/[018]/g, fn));
};

// Define different processors based on file extension
var processors = {
  css: function(fileContents, podGuid) {
    var parsedCss = css.parse(fileContents);
    var transformedParsedCSS = transformCSS(podGuid, parsedCss);
    return css.stringify(transformedParsedCSS);
  },

  scss: wrapStyles,
  less: wrapStyles
};

function wrapStyles(fileContents, podGuid) {
  // Replace instances of :--component with '&'
  fileContents = fileContents.replace(/:--component/g, '&');

  // Wrap the styles inside the generated class
  return '.' + podGuid + '{' + fileContents + '}';
}

function transformCSS(podGuid, parsedCss) {
  var rules = parsedCss.stylesheet.rules;

  rules.forEach(function(rule) {
    rule.selectors = rule.selectors.map(function(selector) {
      var selfSelectorMatch = HAS_SELF_SELECTOR.exec(selector);

      if (selfSelectorMatch) {
        return selector.replace(selfSelectorMatch[0], '.' + podGuid);
      } else {
        return '.' + podGuid + ' ' + selector;
      }
    });
  });

  return parsedCss;
}

function BrocComponentCssPreprocessor(inputTree, options) {
  this.inputTree = inputTree;
  this.options = options;
}

BrocComponentCssPreprocessor.prototype = Object.create(Writer.prototype);

BrocComponentCssPreprocessor.prototype.constructor = BrocComponentCssPreprocessor;

BrocComponentCssPreprocessor.prototype.write = function (readTree, destDir) {
  var pod = this.options.pod;

  return readTree(this.inputTree).then(function(srcDir) {
    var paths = walkSync(srcDir);
    var buffer = [];
    var extension;
    var filepath;

    for (var i = 0, l = paths.length; i < l; i++) {
      filepath = paths[i];

      // Check that it's not a directory
      if (filepath[filepath.length-1] !== '/') {

        if (!extension || extension === 'css') {
          extension = filepath.substr(filepath.lastIndexOf('.') + 1);
        }

        var podPath = filepath.split('/').slice(0, -1);
        var podGuid = podPath.join('--') + '-' + guid();
        var fileContents = fs.readFileSync(path.join(srcDir, filepath)).toString();

        buffer.push(processors[extension](fileContents, podGuid));
        pod.lookup[podPath.join('/')] = podGuid;
      }
    }

    pod.styles = buffer.join('');
    fs.writeFileSync(path.join(destDir, 'pod-styles.' + extension), pod.styles);
  });
};

module.exports = BrocComponentCssPreprocessor;
