var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');

module.exports = RemoveFiles;

RemoveFiles.prototype = Object.create(Plugin.prototype);
RemoveFiles.prototype.constructor = RemoveFiles;
function RemoveFiles(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation
  });
}

RemoveFiles.prototype.build = function() {
  for (var i = 0; i < this.inputPaths.length; i++) {
    var paths = walkSync(this.inputPaths[i], { directories: false });
    for (var j = 0; j < paths.length; j++) {
      var fileContents = fs.readFileSync(path.join(this.inputPaths[i], paths[j]), "utf8");
      if (fileContents.trim()) {
        fs.writeFileSync(path.join(this.outputPath, paths[j]), fileContents);
      }
    }
  }
};
