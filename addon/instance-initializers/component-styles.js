import Component from '@ember/component';
import { getOwner } from '@ember/application';

import podNames from 'ember-component-css/pod-names';

export function initialize(appInstance) {
  let componentLookup = appInstance.lookup('component-lookup:main');
  const originalComponentFor = componentLookup.componentFor;

  componentLookup.componentFor = function(name, owner) {
    owner = owner.hasRegistration ? owner : getOwner(this);

    if (podNames[name] && !owner.hasRegistration(`component:${name}`)) {
      owner.register(`component:${name}`, Component);
    }
    
    return originalComponentFor(...arguments);
  };
}

export default {
  initialize
};
