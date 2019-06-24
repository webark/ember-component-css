const Filter = require('broccoli-persistent-filter');
const componentNames = require('./component-names.js');

module.exports = class NamespaceStyles extends Filter {
  constructor(tree, options = {}) {
    super(tree, {
      annotation: options.annotation
    });

    this.extensions = ['hbs'];
    this.targetExtension = 'hbs';
    this.terseClassNames = options.terseClassNames;
  }

  processString(contents, stylePath) {
    const className = componentNames.class(stylePath, this.terseClassNames);

    return `{{#let (if this.styleNamespace this.styleNamespace '${className}') as |styleNamespace|}}${contents}{{/let}}`
  }
}
