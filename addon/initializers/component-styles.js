import Ember from "ember";
import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { getOwner } from '@ember/application';

import podNames from 'ember-component-css/pod-names';

const {
  ComponentLookup,
} = Ember;

ComponentLookup.reopen({
  componentFor(name, owner) {
    owner = owner.hasRegistration ? owner : getOwner(this);

    if (podNames[name] && !owner.hasRegistration(`component:${name}`)) {
      owner.register(`component:${name}`, Component);
    }
    return this._super(...arguments);
  },
});

Component.reopen({
  _componentIdentifier: computed({
    get() {
      return (this._debugContainerKey || '').replace('component:', '');
    }
  }),

  _shouldAddNamespacedClassName: computed({
    get() {
      return this.get('tagName') !== '' && this.get('styleNamespace');
    }
  }),

  styleNamespace: computed({
    get() {
      return podNames[this.get('_componentIdentifier')] || '';
    }
  }),

  // componentCssClassName: deprecatingAlias('styleNamespace', {
  //   id: 'ember-component-css.deprecate-componentCssClassName',
  //   until: '0.7.0',
  // }),

  componentCssClassName: alias('styleNamespace'),

  init() {
    this._super(...arguments);

    if (this.get('_shouldAddNamespacedClassName')) {
      this.classNames = this.classNames.concat(this.get('styleNamespace'));
    }
  },
});

export function initialize() {}

export default {
  initialize
};
