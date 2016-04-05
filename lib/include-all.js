'use strict';

var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var fs = require('fs');
var FSTree = require('fs-tree-diff');
var Promise = require('rsvp').Promise;
var path = require('path');
var os = require("os");

module.exports = IncludeAll;

IncludeAll.prototype = Object.create(Plugin.prototype);
IncludeAll.prototype.constructor = IncludeAll;
function IncludeAll(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation,
    persistentOutput: true
  });

  this.currentTree = new FSTree();
  this.importedPods = {};
}

IncludeAll.prototype.build = function() {
  var srcDir = this.inputPaths[0];

  var entries = walkSync.entries(srcDir);
  var nextTree = new FSTree.fromEntries(entries, { sortAndExpand: true });
  var currentTree = this.currentTree;

  this.currentTree = nextTree;
  var patches = currentTree.calculatePatch(nextTree);

  return Promise.resolve().then(this.importPods.bind(this, patches, srcDir));
};

IncludeAll.prototype.importPods = function(patches, srcDir) {
  for (var i = 0; i < patches.length; i++) {
    switch (patches[i][0]) {
      case 'create':
        this.addPod(patches[i][1], srcDir);
        break;
      case 'unlink':
        this.removePod(patches[i][1]);
        break;
    }
  }

  for (var extension in this.importedPods) {
    var output = '';
    for (var file in this.importedPods[extension]) {
      output += this.importedPods[extension][file] + ';' + os.EOL;
    }
    fs.writeFileSync(path.join(this.outputPath, 'pod-styles' + extension), output);
  }

  return true;
}

IncludeAll.prototype.addPod = function(stylePath, srcDir) {
  var extension = path.extname(stylePath);

  this.importedPods[extension] = this.importedPods[extension] || {};
  this.importedPods[extension][stylePath] = '@import "' + stylePath + '"';
}

IncludeAll.prototype.removePod = function(stylePath) {
  var extension = path.extname(stylePath);

  delete this.importedPods[extension][stylePath];
}
