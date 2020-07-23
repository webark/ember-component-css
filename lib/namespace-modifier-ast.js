const path = require('path');
const componentNames = require('./component-names.js');

function getModifiers(moduleName) {
  return [{
    param: 'buildClass',
    type: 'string',
    value: componentNames.class(moduleName),
  }, {
    param: 'argsClass',
    type: 'path',
    value: 'this.args.styleNamespace',
  }, {
    param: 'runClass',
    type: 'path',
    value: 'this.styleNamespace',
  }]
}

function addModifier(builders) {
  return ({ param, type, value }) => builders.pair(param,  builders[type](value));
}

function namespaceMofiderAstPlugin({ syntax: { builders }, meta: { moduleName } = {}}) {
  return {
    name: 'namespace-modifier-ast-plugin',

    visitor: {
      ElementModifierStatement(node) {
        const allModifiers = getModifiers(moduleName);
        const neededModifiers = allModifiers.filter(modifier => !node.hash.pairs.find(pair => pair.key === modifier.param));
        node.hash.pairs.push(...neededModifiers.map(addModifier(builders)));
      }
    }
  };
};

module.exports.namespaceMofiderAstPlugin = namespaceMofiderAstPlugin;

module.exports.NamespaceModifierAst = class NamespaceModifierAst {
  get name() {
    return 'namespace-modifier';
  }

  plugin() {
    return namespaceMofiderAstPlugin(...arguments);
  }

  baseDir() {
    return path.join('..', __dirname);
  }
}
