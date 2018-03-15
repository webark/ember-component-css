const fs = require('fs-extra');
const path = require('path');
const Walker = require('./broccoli-walker.js');

module.exports = class StyleInfo extends Walker {
  constructor(tree, options = {}) {
    super(tree, options);
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

  fileContents() {
    return `
      import Component from '@ember/component';
      import layout from './template';
      import { styleNamespace } from './style-info';

      export default Component.extend({
        classNameBindings: ['styleNamespace'],
        styleNamespace,
        layout
      });
    `;
  }

  addFile(stylePath) {
    const componentPath = path.join(this.outputPath, path.dirname(stylePath), 'component.js');

    return fs.outputFileSync(componentPath, this.fileContents());
  }

  removeFile(stylePath) {
    const styleInfoPath = path.join(this.outputPath, path.dirname(stylePath), 'component.js');

    return fs.removeSync(styleInfoPath);
  }
}
