/* eslint-env node */
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

  return Promise.resolve()
    .then(this.importPods.bind(this, patches, srcDir))
    .then(this.ensurePodStyles.bind(this));
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

IncludeAll.prototype.addPod = function(stylePath) {
  var extension = path.extname(stylePath);

  this.importedPods[extension] = this.importedPods[extension] || {};
  this.importedPods[extension][stylePath] = '@import "' + stylePath + '"';
}

IncludeAll.prototype.removePod = function(stylePath) {
  var extension = path.extname(stylePath);

  delete this.importedPods[extension][stylePath];
}

var DUMMY_FILE_COMMENT = '\
/* \n\
  ember-component-css: This is a dummy pod-styles.css file. \n\
  You have not created any component styles, yet. \n\
*/ \n';

IncludeAll.prototype.ensurePodStyles = function() {
  if (Object.keys(this.importedPods).length === 0) {
    if (!this.dummyFile) {
      this.dummyFile = path.join(this.outputPath, 'pod-styles.css');
      fs.writeFileSync(this.dummyFile, DUMMY_FILE_COMMENT);
      console.warn('\nember-component-css: You have not yet created a component style file.')
    }
  } else if (this.dummyFile) {
    fs.unlinkSync(this.dummyFile);
    delete this.dummyFile;
  }

  return true;
}
