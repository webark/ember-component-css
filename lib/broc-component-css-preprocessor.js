/* jshint node: true */
'use strict';

var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var css = require('css');

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

function BrocComponentCssPreprocessor(inputTree,options) {
  this.inputTree = inputTree;
  this.options = options;
};

BrocComponentCssPreprocessor.prototype = Object.create(Writer.prototype);

BrocComponentCssPreprocessor.prototype.constructor = BrocComponentCssPreprocessor;

BrocComponentCssPreprocessor.prototype.write = function (readTree, destDir) {
  var pod = this.options.pod;

  return readTree(this.inputTree).then(function(srcDir) {
    var buffer = [];
    var preprocessorBuffer = [];
    var paths = walkSync(srcDir);
    var filepath;
    for (var i = 0, l = paths.length; i < l; i++) {
      filepath = paths[i];

      if (filepath[filepath.length-1] !== '/') {
        var podPath = filepath.split('/').slice(0, -1);
        var podGuid = podPath.join('--') + '-' + guid();
        var cssFileContents = fs.readFileSync(path.join(srcDir, filepath)).toString();

        if (CSS_SUFFIX.test(filepath)) {
          var parsedCss = css.parse(cssFileContents);
          var transformedParsedCSS = transformCSS(podGuid, parsedCss);
          buffer.push(css.stringify(transformedParsedCSS));
        } else {
          // We're using a preprocessor
          // Replace instances of :--component with '&'
          cssFileContents = cssFileContents.replace(/:--component/g, '&');

          // Wrap the styles inside the generated class
          var wrappedCss = '.' + podGuid + '{\n' + cssFileContents;

          // Indent everything in case using an indentation-based preprocesser (e.g., .sass)
          var formattedCss = wrappedCss.replace(/[\n\r]/g, '\n\r  ');
          preprocessorBuffer.push(formattedCss + '\n}');
        }

        pod.lookup[podPath.join('/')] = podGuid;
      }
    }

    // ISSUES: do we allow mixing? Or force them to use one extension? If so, do they specify it?
    fs.writeFileSync(path.join(destDir, 'pod-styles.scss'), preprocessorBuffer.join(''));
    pod.styles = buffer.join('');
  });
};

module.exports = BrocComponentCssPreprocessor;
