'use strict';

const {
  ColocatedNamespacedStyles,
  ColocatedNamespaceObjects,
  ColocatedNamespaceTemplates,
} = require('./lib/colocate-namespace.js');

module.exports = {
  _templateOnlyGlimmerComponents() {
    return false;
  },

  _defaultOptions(enviroment) {
    return {
      terseClassNames: enviroment === 'production',
      excludeFromManifest: [],
      includeDeprecatedPodStylesFile: true,
    };
  },

  _options(registry) {
    const options = (this.parent && this.parent.options) || (registry.app && registry.app.options) || {};

    return Object.assign(this._defaultOptions(), options.emberCliStyles);
  },

  setupPreprocessorRegistry(type, registry) {
    const isAddon = Boolean(this.parent.parent);
    const templateOnly = this._templateOnlyGlimmerComponents();

    const config = this._options(registry);
    const terseClassNames = config.terseClassNames;
    const excludeFromManifest = config.excludeFromManifest;
    const includeDeprecatedPodStylesFile = config.includeDeprecatedPodStylesFile;

    registry.add('css', new ColocatedNamespacedStyles({
      terseClassNames,
      excludeFromManifest,
      includeDeprecatedPodStylesFile,
      isAddon,
      registry,
    }));

    registry.add('js', new ColocatedNamespaceObjects({
      isAddon,
      templateOnly,
      registry,
    }));

    if (templateOnly) {
      registry.add('template', new ColocatedNamespaceTemplates({
        terseClassNames,
        isAddon,
        registry,
      }));
    }
  },

  name: require('./package').name
};
