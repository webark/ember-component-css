const fs = require('fs-extra');
const path = require('path');
const Walker = require('./broccoli-walker.js');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);

    this.fileToInclude = options.fileToInclude;
    this.siblingsMatch = [this.fileToInclude].concat(options.siblingsMatch || []);
    this.siblingsExclude = options.siblingsExclude || [];
  }

  walker(patches) {
    for (let patch of patches) {
      switch (patch[0]) {
        case 'mkdir':
          this.keepFile(patch[1]);
          break;
        case 'rmdir':
          this.removeFile(patch[1]);
          break;
      }
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

  keepFile(dirPath) {
    if (this.hasSibling(dirPath) && !this.notSibling(dirPath)) {
      fs.ensureSymlinkSync(path.join(this.inputPath, dirPath, this.fileToInclude), path.join(this.outputPath, dirPath, this.fileToInclude));
    }
  }

  removeFile(dirPath) {
    if (!this.hasSibling(dirPath) || this.notSibling(dirPath)) {
      fs.removeSync(path.join(this.outputPath, dirPath, this.fileToInclude));
    }
  }
}
