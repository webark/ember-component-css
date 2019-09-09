const fs = require('fs-extra');
const path = require('path');
const Walker = require('broccoli-tree-walker');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);

    this.fileToInclude = options.fileToInclude;
    this.siblingsMatch = [this.fileToInclude].concat(options.siblingsMatch || []);
    this.siblingsExclude = options.siblingsExclude || [];
  }

  mkdir(dirPath) {
    if (this.hasSibling(dirPath) && !this.notSibling(dirPath)) {
      fs.ensureSymlinkSync(path.join(this.inputPath, dirPath, this.fileToInclude), path.join(this.outputPath, dirPath, this.fileToInclude));
    }
  }

  rmdir(dirPath) {
    if (!this.hasSibling(dirPath) || this.notSibling(dirPath)) {
      fs.removeSync(path.join(this.outputPath, dirPath, this.fileToInclude));
    }
  }

  hasSibling(dirPath) {
    if (!this.siblingsMatch.length) return false;
    const dir = path.join(this.inputPath, dirPath);
    const dirFiles = fs.readdirSync(dir);

    return this.siblingsMatch.every(file => dirFiles.includes(file));
  }

  notSibling(dirPath) {
    if (!this.siblingsExclude.length) return false;
    const dir = path.join(this.inputPath, dirPath);
    const dirFiles = fs.readdirSync(dir);

    return this.siblingsExclude.every(file => dirFiles.includes(file));
  }
}
