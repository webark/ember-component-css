const Filter = require('broccoli-persistent-filter');
const componentNames = require('./component-names.js');

module.exports = class NamespaceStyles extends Filter {
  constructor(tree, options = {}) {
    super(tree, {
      annotation: options.annotation
    });

    this.extensions = ['hbs'];
    this.terseClassNames = options.terseClassNames;
    this.targetExtension = 'hbs';
  }

  processString(contents, stylePath) {
    const className = componentNames.class(stylePath, this.terseClassNames);

    return `{{#let '${className}' as |styleNamespace|}}${contents}{{/let}}`
  }
}
