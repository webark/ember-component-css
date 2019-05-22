'use strict';

const path = require('path');

const Funnel = require('broccoli-funnel');

const {
  ColocatedNamespacedStyles,
  ColocatedNamespaceObjects,
  ColocatedNamespaceTemplates,
} = require('./lib/colocate-namespace.js');

module.exports = {
  _templateOnlyGlimmerComponents() {
    const optionalFeaturesAddon = this.addons.find(a => a.name === '@ember/optional-features');
    return optionalFeaturesAddon && optionalFeaturesAddon.isFeatureEnabled('template-only-glimmer-components');
  },

  _defaultOptions(enviroment) {
    return {
      terseClassNames: enviroment === 'production',
      excludeFromManifest: [],
      includeDeprecatedPodStylesFile: true,
    };
  },

  _options(registry) {
    const {
      emberCliStyles,
    } = (this.parent && this.parent.options) || (registry.app && registry.app.options) || {};

    return Object.assign(this._defaultOptions(), emberCliStyles);
  },

  _isAddon() {
    return Boolean(this.parent.parent);
  },

  _baseNode(app) {
    if (app.treePaths) {
      return new Funnel(path.join(app.root, app.treePaths['addon']));
    } else {
      const appTree = (app.app || app).trees['app'];
      if (typeof appTree === 'string') {
        return new Funnel(path.join(app.project.root, appTree));
      } else {
        return appTree;
      }
    }
  },

  setupPreprocessorRegistry(type, registry) {
    const baseNode = this._baseNode(registry.app);
    const templateOnly = this._templateOnlyGlimmerComponents();

    const {
      terseClassNames,
      excludeFromManifest,
      includeDeprecatedPodStylesFile,
    } = this._options(registry);

    registry.add('css', new ColocatedNamespacedStyles({
      registry,
      baseNode,
      terseClassNames,
      excludeFromManifest,
      includeDeprecatedPodStylesFile,
    }));

    registry.add('js', new ColocatedNamespaceObjects({
      registry,
      baseNode,
      templateOnly,
    }));

    if (templateOnly) {
      registry.add('template', new ColocatedNamespaceTemplates({
        registry,
        baseNode,
        terseClassNames,
      }));
    }
  },

  name: require('./package').name
};
