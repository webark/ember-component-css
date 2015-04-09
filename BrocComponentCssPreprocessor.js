/* jshint node: true */
'use strict';

var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var css = require('css');

var podLookup = Object.create(null);

var CSS_SUFFIX = /\.css$/;
var HAS_SELF_SELECTOR = /&|:--component/;

var guid = function fn(n) {
  return n ?
           (n ^ Math.random() * 16 >> n/4).toString(16) :
           ('10000000'.replace(/[018]/g, fn));
};

function transformCSS(podGuid, parsedCss) {
  var rules = parsedCss.stylesheet.rules;

  rules.forEach(function(rule) {
    rule.selectors = rule.selectors.map(function(selector) {
      var selfSelectorMatch = HAS_SELF_SELECTOR.exec(selector);
      if (selfSelectorMatch) {
        return selector.replace(selfSelectorMatch[0], '.' + podGuid);
      } else {
        return '.' + podGuid + " " + selector;
      }
    });
  });

  return parsedCss;
}

function BrocComponentCssPreprocessor(inputTree) {
  this.inputTree = inputTree;
};

BrocComponentCssPreprocessor.prototype = Object.create(Writer.prototype);

BrocComponentCssPreprocessor.prototype.constructor = BrocComponentCssPreprocessor;

BrocComponentCssPreprocessor.prototype.write = function (readTree, destDir) {
  return readTree(this.inputTree).then(function(srcDir) {
    var buffer = [];
    var paths = walkSync(srcDir);
    var filepath;
    for (var i = 0, l = paths.length; i < l; i++) {
      filepath = paths[i];
      if (!CSS_SUFFIX.test(filepath)) { continue; }
      var podPath = filepath.split('/').slice(0, -1);
      var podGuid = podPath.join('--') + '-' + guid();
      var cssFileContents = fs.readFileSync(path.join(srcDir, filepath)).toString();
      var parsedCss = css.parse(cssFileContents);
      var transformedParsedCSS = transformCSS(podGuid, parsedCss);
      buffer.push(css.stringify(transformedParsedCSS));
      podLookup[podPath.join('/')] = podGuid;
    }

    fs.writeFileSync(path.join(destDir, 'pod-styles.css'), buffer.join(''));
    fs.writeFileSync(path.join(destDir, 'pod-lookup.json'), JSON.stringify(podLookup));
  });
};

module.exports = BrocComponentCssPreprocessor;
