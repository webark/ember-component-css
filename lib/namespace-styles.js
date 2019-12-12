const Filter = require('broccoli-persistent-filter');
const componentNames = require('./component-names.js');
const processStratagies = require('./preprocess-class-names');
const path = require('path');

module.exports = class NamespaceStyles extends Filter {
  constructor(tree, options = {}) {
    super(tree, {
      annotation: options.annotation
    });

    this.extensions = options.extensions;
    this.terseClassNames = options.terseClassNames;
    this.prefix = options.prefix;
  }

  processString(contents, stylePath) {
    const extension = path.extname(stylePath);
    if (!stylePath.startsWith(this.prefix)) {
      stylePath = this.prefix + '/' + stylePath;
    }
    const className = componentNames.class(stylePath, this.terseClassNames);

    let strategy = 'default';

    switch (extension) {
      case '.styl':
      case '.sass':
        strategy = 'indentation';
        break;
      case '.less':
      case '.scss':
        strategy = 'syntax';
        break;
    }

    return processStratagies[strategy](contents, className, extension);
  }
}
