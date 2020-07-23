const fs = require('fs-extra');
const path = require('path');
const componentNames = require('./component-names.js');
const Walker = require('broccoli-tree-walker');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);

    this.terseClassNames = options.terseClassNames;
  }

  fileContents(styleNamespace) {
    return `export default { styleNamespace: "${styleNamespace}" }`;
  }

  fullStylePath(stylePath) {
    return path.join(this.outputPath, stylePath + '.js');
  }

  create(stylePath) {
    const styleNamespace = componentNames.class(stylePath, this.terseClassNames);
    const styleFile = this.fileContents(styleNamespace);
    const fullStyleFilePath = this.fullStylePath(stylePath)

    return fs.outputFileSync(fullStyleFilePath, styleFile);
  }

  unlink(stylePath) {
    const fullStyleFilePath = this.fullStylePath(stylePath)

    return fs.removeSync(fullStyleFilePath);
  }
}
