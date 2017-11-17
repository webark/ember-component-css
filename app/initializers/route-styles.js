import Router from '@ember/routing/router';
import { getOwner } from '@ember/application';
import podNames from 'ember-component-css/pod-names';

Router.reopen({
  didTransition(routes) {
    this._super(...arguments);

    const classes = [];
    for (let route of routes) {
      let currentPath = route.name.replace(/\./g, '/');

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
  name: 'route-styles',
  initialize
};
