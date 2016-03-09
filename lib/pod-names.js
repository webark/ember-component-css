var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var componentNames = require('./component-names.js');

module.exports = PodNames;

PodNames.prototype = Object.create(Plugin.prototype);
PodNames.prototype.constructor = PodNames;
function PodNames(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation
  });
}

PodNames.prototype.build = function() {
  var srcDir = this.inputPaths[0];
  var destDir = this.outputPath;
  var paths = walkSync(srcDir, { directories: false });
  var podNameJson = {};

  for (var i = 0; i < paths.length; i++) {
    var componentPath = componentNames.path(paths[i]),
        componentClass = componentNames.class(paths[i]);
    podNameJson[componentPath] = componentClass;
  }

  var output = 'export default ' + JSON.stringify(podNameJson);
  fs.writeFileSync(path.join(destDir, 'pod-names.js'), output);
};
