const fs = require('fs-extra');
const path = require('path');
const componentNames = require('./component-names.js');
const Walker = require('./broccoli-walker.js');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);

    this.terseClassNames = options.terseClassNames;
  }

  walker(patches) {
    for (let patch of patches) {
      switch (patch[0]) {
        case 'create':
          this.addFile(patch[1]);
          break;
        case 'unlink':
          this.removeFile(patch[1]);
          break;
      }
    }
  }

  fileContents({ styleNamespace }) {
    return `
      import EmberObject from '@ember/object';

      export const styleNamespace = "${styleNamespace}"
      export default EmberObject.extend({ styleNamespace });
    `;
  }

  addFile(stylePath) {
    const styleNamespace = componentNames.class(stylePath, this.terseClassNames);
    const styleInfoPath = path.join(this.outputPath, path.dirname(stylePath), 'styles.js');

    return fs.outputFileSync(styleInfoPath, this.fileContents({ styleNamespace }));
  }

  removeFile(stylePath) {
    const styleInfoPath = path.join(this.outputPath, path.dirname(stylePath), 'styles.js');

    return fs.removeSync(styleInfoPath);
  }
}
