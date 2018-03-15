'use strict';

const ColocatedNamespaced = require('./lib/colocate-namespace.js');
const ColocatedNamespacedStyles = ColocatedNamespaced.ColocatedNamespacedStyles;
const ColocatedNamespaceObjects = ColocatedNamespaced.ColocatedNamespaceObjects;

module.exports = {
  _getEnvironment() {
    if (!this._findHost) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
    }

    return this._findHost().env;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    this.appConfig = app.project.config(this._getEnvironment());
    this.addonConfig = this.appConfig['ember-component-css'] || {};

    this.terseClassNames = Boolean(this.addonConfig.terseClassNames);
    this.excludeFromManifest = this.addonConfig.excludeFromManifest || [];
  },

  config(enviroment) {
    return {
      "ember-component-css": {
        terseClassNames: enviroment === 'production',
      },
    };
  },

  setupPreprocessorRegistry(type, registry) {
    const isAddon = Boolean(this.parent.parent);
    const terseClassNames = this.terseClassNames;
    const excludeFromManifest = this.excludeFromManifest;

    registry.add('css', new ColocatedNamespacedStyles({
      terseClassNames,
      excludeFromManifest,
      isAddon,
      registry,
    }));

    registry.add('js', new ColocatedNamespaceObjects({
      isAddon,
      registry,
    }));
  },

  name: 'ember-component-css',
};
