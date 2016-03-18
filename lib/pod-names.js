'use strict';

var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var fs = require('fs');
var FSTree = require('fs-tree-diff');
var Promise = require('rsvp').Promise;
var path = require('path');
var componentNames = require('./component-names.js');

module.exports = PodNames;

PodNames.prototype = Object.create(Plugin.prototype);
PodNames.prototype.constructor = PodNames;
function PodNames(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation,
    persistentOutput: true
  });

  this.currentTree = new FSTree();
  this.podNameJson = {};
}

PodNames.prototype.build = function() {
  var srcDir = this.inputPaths[0];

  var entries = walkSync.entries(srcDir);
  var nextTree = new FSTree.fromEntries(entries);
  var currentTree = this.currentTree;

  this.currentTree = nextTree;
  var patches = currentTree.calculatePatch(nextTree);

  return Promise.resolve().then(this.writePodStyleName.bind(this, patches));
};

PodNames.prototype.writePodStyleName = function(patches) {
  for (var i = 0; i < patches.length; i++) {
    switch (patches[i][0]) {
      case 'create':
        this.addClass(patches[i][1]);
        break;
      case 'unlink':
        this.removeClass(patches[i][1]);
        break;
    }
  }

  var output = 'export default ' + JSON.stringify(this.podNameJson);
  return fs.writeFileSync(path.join(this.outputPath, 'pod-names.js'), output);
}

PodNames.prototype.addClass = function(stylePath) {
  var componentPath = componentNames.path(stylePath),
      componentClass = componentNames.class(stylePath);
  this.podNameJson[componentPath] = componentClass;
}

PodNames.prototype.removeClass = function(stylePath) {
  var componentPath = componentNames.path(stylePath);
  delete this.podNameJson[componentPath];
}
