/* jshint node: true */
'use strict';

var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var path = require('path');
var css = require('css');
var fs = require('fs');

var namespaceSelector = require('./namespace-selector');
var guid = function fn(n) {
  return n ?
           (n ^ Math.random() * 16 >> n/4).toString(16) :
           ('10000000'.replace(/[018]/g, fn));
};

// Define different processors based on file extension
var processors = {
  css: function(fileContents, podPath, podGuid) {
    var parsedCss = css.parse(fileContents);
    var transformedParsedCSS = transformCSS(podPath, podGuid, parsedCss);
    return css.stringify(transformedParsedCSS);
  },

  styl: function(fileContents, podPath, podGuid) {
    fileContents = fileContents.replace(/:--component/g, '&');
    fileContents = '.' + podGuid + '\n' + fileContents;

    // Indent styles for scoping
    return fileContents.replace(/\n/g, '\n  ');
  },

  scss: wrapStyles,
  less: wrapStyles
};

function wrapStyles(fileContents, podPath, podGuid) {
  // Replace instances of :--component with '&'
  fileContents = fileContents.replace(/:--component/g, '&');

  // Wrap the styles inside the generated class
  return '.' + podGuid + '{' + fileContents + '}';
}

function transformCSS(podPath, podGuid, parsedCss) {
  var rules = parsedCss.stylesheet.rules;

  rules.forEach(function(rule) {
    rule.selectors = rule.selectors.map(function(selector) {
      // Replace & with :--component so that it's valid CSS
      selector = selector.replace(/&/g, ':--component');

      try {
        return namespaceSelector(selector, podGuid);
      } catch (e) {
        throw new Error('Invalid selector "' + selector + '" in styles for component ' +
          podPath + '.\n' + e.message);
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
    var filepath;

    for (var i = 0, l = paths.length; i < l; i++) {
      filepath = paths[i];

      // Check that it's not a directory
      if (filepath[filepath.length-1] !== '/') {

        if (!pod.extension || pod.extension === 'css') {
          pod.extension = filepath.substr(filepath.lastIndexOf('.') + 1);
        }

        var podPathSegments = filepath.split('/').slice(0, -1);

        // Handle pod-formatted components that are in the 'components' directory
        if (podPathSegments[0] === 'components') {
          podPathSegments.shift();
        }

        var podGuid = podPathSegments.join('--') + '-' + guid();
        var podPath = podPathSegments.join('/');

        var fileContents = fs.readFileSync(path.join(srcDir, filepath)).toString();

        buffer.push(processors[pod.extension](fileContents, podPath, podGuid));
        pod.lookup[podPath] = podGuid;
      }
    }

    pod.styles = buffer.join('');
    fs.writeFileSync(path.join(destDir, 'pod-styles.' + pod.extension), pod.styles);
  });
};

module.exports = BrocComponentCssPreprocessor;
