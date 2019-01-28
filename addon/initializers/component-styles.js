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
      const config = Ember.getOwner(this).resolveRegistration('config:environment');

      // support /-components/ paths, debug key has full path
      let containerKey = this._debugContainerKey || '';
      containerKey = containerKey.replace('/' + config.modulePrefix + '/', '');
      if (!containerKey.includes('@')) {
        containerKey = containerKey.replace('component:', 'component:' + config.modulePrefix + '@');
      }
      if (containerKey.split('/').length === 1) {
        containerKey = containerKey.replace('@', '@components/');
      }
      return containerKey;
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
