import Router from '@ember/routing/router';
import { getOwner } from '@ember/application';

import podNames from 'ember-component-css/pod-names';
import Ember from "ember";

Router.reopen({
  didTransition(routes) {
    this._super(...arguments);

    const classes = [];
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];
      let currentPath = 'route:' + route.name.replace(/\./g, '/');

      const config = Ember.getOwner(this).resolveRegistration('config:environment');
      if (!currentPath.includes('@')) {
        currentPath = currentPath.replace('route:', 'route:' + config.modulePrefix + '@');
      }

      if (podNames[currentPath]) {
        getOwner(this).lookup(`controller:${route.name}`).set('styleNamespace', podNames[currentPath]);
        classes.push(podNames[currentPath]);
      }
    }

    getOwner(this).lookup('controller:application').set('routeStyleNamespaceClassSet', classes.join(' '));
  }
});

export function initialize() {}

export default {
  initialize
};
