const fs = require('fs-extra');
const path = require('path');
const Walker = require('./broccoli-walker.js');

module.exports = class StyleInfo extends Walker {
  fileContents() {
    return `
      import Component from '@ember/component';
      import layout from './template';
      import { styleNamespace } from './styles';

      export default Component.extend({
        classNameBindings: ['styleNamespace'],
        styleNamespace,
        layout
      });
    `;
  }

  create(stylePath) {
    const componentPath = path.join(this.outputPath, path.dirname(stylePath), 'component.js');

    return fs.outputFileSync(componentPath, this.fileContents());
  }

  unlink(stylePath) {
    const styleInfoPath = path.join(this.outputPath, path.dirname(stylePath), 'component.js');

    return fs.removeSync(styleInfoPath);
  }
}
