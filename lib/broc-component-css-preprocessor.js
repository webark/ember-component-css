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

  styl: indentStyles,
  sass: indentStyles,

  scss: wrapStyles,
  less: wrapStyles
};

function indentStyles(fileContents, podGuid) {
  fileContents = fileContents.replace(/:--component/g, '&');
  fileContents = '.' + podGuid + '\n' + fileContents;

  // Indent styles for scoping and make sure it ends with a
  // newline that is not indented
  return fileContents.replace(/\n/g, '\n  ') + '\n';
}

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
  this.guidCache = {};
}

BrocComponentCssPreprocessor.prototype = Object.create(Writer.prototype);

BrocComponentCssPreprocessor.prototype.constructor = BrocComponentCssPreprocessor;

BrocComponentCssPreprocessor.prototype.write = function (readTree, destDir) {
  var pod = this.options.pod;
  var guidCache = this.guidCache;

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

        var podPath = filepath.split('/').slice(0, -1);

        // Handle pod-formatted components that are in the 'components' directory
        if (podPath[0] === 'components') {
          podPath.shift();
        }

        // Get cached podGuid or create a new one
        var podClassName = podPath.join('--');
        var podGuid;
        if (podClassName in guidCache) {
          podGuid = guidCache[podClassName];
        } else {
          podGuid = guidCache[podClassName] = podClassName + '-' + guid();
        }
  
        var fileContents = fs.readFileSync(path.join(srcDir, filepath)).toString();

        buffer.push(processors[pod.extension](fileContents, podGuid));
        pod.lookup[podPath.join('/')] = podGuid;
      }
    }

    pod.styles = buffer.join('');
    fs.writeFileSync(path.join(destDir, 'pod-styles.' + pod.extension), pod.styles);
  });
};

module.exports = BrocComponentCssPreprocessor;
