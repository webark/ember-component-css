const STYLE_NAMESPACE_PROPERTY = {
  NAME: 'styleNamespace',
  PATH: './styles',
};

function mainClassObject(path, t) {
  let exportDeclaration = path.get('body').find(innerPath => innerPath.isExportDefaultDeclaration()).get('declaration');

  if (!exportDeclaration.isCallExpression()) {
    const exportIndentiferName = exportDeclaration.node.name;
    exportDeclaration = path.get('body').filter(innerPath => innerPath.isVariableDeclaration())
      .reduceRight((previousPath, currentPath) => previousPath.get('declarations').concat(currentPath.get('declarations')))
    if (exportDeclaration instanceof Array) {
      exportDeclaration = exportDeclaration.find(innerPath => innerPath.get('id').isIdentifier({ name: exportIndentiferName }))
    } else {
      exportDeclaration = exportDeclaration.get('declarations.0');
    }
    exportDeclaration = exportDeclaration.get('init');
  }
  if (!exportDeclaration.get('arguments.length')) {
    exportDeclaration.pushContainer('arguments', t.ObjectExpression([]));
  }
  return exportDeclaration.get('arguments').find(innerPath => innerPath.isObjectExpression());
}

function isImportable(path) {
  return path.get('body').some(innerPath => innerPath.isExportDefaultDeclaration())
}

module.exports = function ({ types: t }) {
  return {
    name: "ember-style-namespaceing",
    visitor: {
      ObjectProperty(path) {
        path.skip();
        if (!this.found) {
          if (path.get('key').isIdentifier({ name: 'classNameBindings' })) {
            if (path.get('value.elements').some(value => value.isStringLiteral({ value: STYLE_NAMESPACE_PROPERTY.NAME }))) {
                this.found = true;
                path.stop();
            } else {
              this.classNameBindingsPath = path.get('value');
            }
          } else if (path.get("key").isIdentifier({ name: STYLE_NAMESPACE_PROPERTY.NAME })) {
              this.found = true;
              path.stop();
          }
        }
      },

      ImportSpecifier(path) {
        if (!this.found && path.get('local').isIdentifier({ name: STYLE_NAMESPACE_PROPERTY.NAME })) {
            this.found = true;
            path.stop();
        }
      },

      Program: {
        exit(path) {
          if (!this.found && isImportable(path)) {
            const styleIdentifier = t.identifier(STYLE_NAMESPACE_PROPERTY.NAME);
            const styleString = t.stringLiteral(STYLE_NAMESPACE_PROPERTY.NAME);

            const importDeclaration = t.importDeclaration([t.importSpecifier(styleIdentifier, styleIdentifier)], t.stringLiteral(STYLE_NAMESPACE_PROPERTY.PATH));
            const propertyDefinition = t.ObjectProperty(styleIdentifier, styleIdentifier);
            const classNameBindings = t.ObjectProperty(t.identifier('classNameBindings'), t.arrayExpression([styleString]));

            const mainObject = mainClassObject(path, t);

            path.unshiftContainer('body', importDeclaration);
            mainObject.pushContainer('properties', propertyDefinition);
            if (this.classNameBindingsPath) {
              this.classNameBindingsPath.pushContainer('elements', styleString);
            } else {
              mainObject.pushContainer('properties', classNameBindings);
            }
          }
        }
      }
    },
  };
};

module.exports.baseDir = function() { return require('path').resolve(__dirname, '..'); };
