const fs = require('fs-extra');
const path = require('path');
const componentNames = require('./component-names.js');
const Walker = require('broccoli-tree-walker');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);

    this.terseClassNames = options.terseClassNames;
  }

  fileContents({ styleNamespace }) {
    return `
      import EmberObject from '@ember/object';

      export const styleNamespace = "${styleNamespace}"
      export default EmberObject.extend({ styleNamespace });
    `;
  }

  create(stylePath) {
    const styleNamespace = componentNames.class(stylePath, this.terseClassNames);
    const styleInfoPath = path.join(this.outputPath, path.dirname(stylePath), 'styles.js');

    return fs.outputFileSync(styleInfoPath, this.fileContents({ styleNamespace }));
  }

  unlink(stylePath) {
    const styleInfoPath = path.join(this.outputPath, path.dirname(stylePath), 'styles.js');

    return fs.removeSync(styleInfoPath);
  }
}
