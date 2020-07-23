'use strict';

const {
  MoveAddonColocatedStyles,
  ColocateStyles,
  NamespaceStyles,
  ColocatedNamespaceObjects,
} = require('./lib/colocate-namespace.js');

const {
  NamespaceModifierAst,
} = require('./lib/namespace-modifier-ast');

module.exports = {
  _defaultOptions(registry) {
    return {
      terseClassNames: false,
      baseName: registry.app.name,
      getCssExtentions: registry.extensionsForType.bind(registry, 'css'),
    };
  },

  _overrideOptions({ options = {} }) {
    return {
      terseClassNames: options.enviroment,
      ...options.emberCliStyleOptions,
    };
  },

  _options(registry) {
    return {
      ...this._defaultOptions(registry),
      ...this._overrideOptions(registry),
    };
  },

  isAddon() {
    return Boolean(this.parent.parent);
  },

  setupPreprocessorRegistry(type, registry) {
    const options = this._options(registry);

    if (this.isAddon()) {
      this.addAddonStyleHack(registry, options);
    }
    
    registry.add('css', new ColocateStyles(options));
    registry.add('css', new NamespaceStyles(options));
    registry.add('js', new ColocatedNamespaceObjects(options));

    registry.add('htmlbars-ast-plugin', new NamespaceModifierAst());
  },

  addAddonStyleHack(registry, options) {
    const addonRealDir = require('path').join(registry.app.root, registry.app.treePaths.addon);

    registry.add('css', new MoveAddonColocatedStyles({
      addonRealDir,
      ...options,
    }));
  },

  name: require('./package').name
};
