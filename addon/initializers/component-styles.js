import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import getOwner from 'ember-getowner-polyfill';

const {
  Component,
  ComponentLookup,
  computed,
  inject,
} = Ember;

ComponentLookup.reopen({
  componentFor(name, owner) {
    owner = owner.hasRegistration ? owner : getOwner(this);

    if (podNames[name] && !owner.hasRegistration(`component:${name}`)) {
      owner.register(`component:${name}`, Component);
    }
    return this._super(...arguments);
  }
});

Component.reopen({
  _componentNamespacingExtras: inject.service('component-namespacing-extras'),

  _componentIdentifier: computed({
    get() {
      return this.get('_componentNamespacingExtras').componentIdentifier(this._debugContainerKey);
    }
  }),

  componentCssClassName: computed({
    get() {
      return podNames[this.get('_componentIdentifier')] || '';
    }
  }),

  init() {
    this._super(...arguments);

    let name = this.get('componentCssClassName');

    if (this.get('tagName') !== '' && name) {
      this.classNames = this.classNames.concat(name);
    }
  }
});

export function initialize() {}

export default {
  name: 'component-styles',
  initialize
};
