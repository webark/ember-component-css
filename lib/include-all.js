'use strict';

var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var fs = require('fs');
var FSTree = require('fs-tree-diff');
var Promise = require('rsvp').Promise;
var path = require('path');
//var os = require("os");

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
  var nextTree = new FSTree.fromEntries(entries);
  var currentTree = this.currentTree;

  this.currentTree = nextTree;
  var patches = currentTree.calculatePatch(nextTree);

  return Promise.resolve().then(this.importPods.bind(this, patches, srcDir));
};

IncludeAll.prototype.importPods = function(patches, srcDir) {
  for (var i = 0; i < patches.length; i++) {
    switch (patches[i][0]) {
      case 'create':
      case 'change':
        this.addPod(patches[i][1], srcDir);
        break;
      case 'unlink':
        this.removePod(patches[i][1]);
        break;
    }
  }

  if (Object.keys(this.importedPods).length === 0) {
    if (!this.dummyFile) {
      // Create empty pod-styles to prevent compile error
      this.dummyFile = path.join(this.outputPath, 'pod-styles.css');
      fs.writeFileSync(this.dummyFile, '/* ember-component-css: This is a dummy pod-styles.css file. You have not created any component styles, yet. */');
    }
  } else if (this.dummyFile) {
    // Delete the dummy file
    fs.unlinkSync(this.dummyFile);
    delete this.dummyFile;
  }

  for (var extention in this.importedPods) {
    var output = '';
    for (var file in this.importedPods[extention]) {
      output += this.importedPods[extention][file];// + ';' + os.EOL;
    }
    fs.writeFileSync(path.join(this.outputPath, 'pod-styles' + extention), output);
  }

  return true;
}

IncludeAll.prototype.addPod = function(stylePath, srcDir) {
  var extention = path.extname(stylePath);

  this.importedPods[extention] = this.importedPods[extention] || {};

  // wanted to use an import manifest rather then combining all the files
  // so that when it goes through it's final css preprocessor stage
  // it can create the appropriate .map files. Wasn't able to find the file tough..
  //
  // this.importedPods[extention][stylePath] = '@import "' + stylePath + '"';
  this.importedPods[extention][stylePath] = fs.readFileSync(path.join(srcDir, stylePath), "utf8");
}

IncludeAll.prototype.removePod = function(stylePath) {
  var extention = path.extname(stylePath);

  delete this.importedPods[extention][stylePath];
}
