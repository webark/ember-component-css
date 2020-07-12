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

  processString(content, stylePath) {
    const className = componentNames.class(stylePath, this.terseClassNames);
    const replacement = `style-namespace (if this.styleNamespace this.styleNamespace (if this.args.styleNamespace this.args.styleNamespace '${className}'))`;

    return content.replace(/style-namespace/g, replacement);
  }
}
