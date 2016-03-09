import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';

const {
  Component,
  ComponentLookup,
} = Ember;

export function initialize() {

  ComponentLookup.reopen({
    componentFor(name, owner) {
      if (podNames[name] && !owner.application.hasRegistration('component:' + name)) {
        owner.application.register('component:' + name, Component);
      }
      return this._super(...arguments);
    }
  });

  Component.reopen({
    init() {
      this._super(...arguments);
      if (this.tagName !== '' && this._debugContainerKey) {
        const name = this._debugContainerKey.replace('component:', '');
        if (podNames[name]) {
          this.classNames.push(podNames[name]);
        }
      }
    }
  });
}

export default {
  name: 'component-styles',
  initialize
};
