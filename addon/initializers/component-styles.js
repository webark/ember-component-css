import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';

const {
  Component,
  ComponentLookup,
} = Ember;

ComponentLookup.reopen({
  componentFor(name, owner) {
    if (podNames[name] && !owner.hasRegistration('component:' + name)) {
      owner.register('component:' + name, Component);
    }
    return this._super(...arguments);
  }
});

Component.reopen({
  init() {
    this._super(...arguments);
    if (this.get('tagName') !== '' && this._debugContainerKey) {
      const name = this._debugContainerKey.replace('component:', '');
      if (podNames[name]) {
        this.classNames.push(podNames[name]);
      }
    }
  }
});

export function initialize() {}

export default {
  name: 'component-styles',
  initialize
};
