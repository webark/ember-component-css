const fs = require('fs-extra');
const path = require('path');
const componentNames = require('./component-names.js');
const Walker = require('broccoli-tree-walker');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);

    this.terseClassNames = options.terseClassNames;
    this.prefix = options.prefix;
  }

  fileContents(styleNamespace) {
    return `
      import EmberObject from '@ember/object';

      export const styleNamespace = "${styleNamespace}"
      export default class extends EmberObject { styleNamespace = styleNamespace };
    `;
  }

  fullStylePath(stylePath) {
    return path.join(this.outputPath, path.dirname(stylePath), 'styles.js');
  }

  create(stylePath) {
    let stylePathClass = stylePath;
    if (!stylePath.startsWith(this.prefix)) {
      stylePathClass = this.prefix + '/' + stylePath;
    }
    const styleNamespace = componentNames.class(stylePathClass, this.terseClassNames);
    const styleFile = this.fileContents(styleNamespace);
    const fullStyleFilePath = this.fullStylePath(stylePath)

    return fs.outputFileSync(fullStyleFilePath, styleFile);
  }

  unlink(stylePath) {
    const fullStyleFilePath = this.fullStylePath(stylePath)

    return fs.removeSync(fullStyleFilePath);
  }
}
