import Router from '@ember/routing/router';
import { getOwner } from '@ember/application';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

Router.reopen(StyleNamespacingExtras, {
  didTransition(routes) {
    this._super(...arguments);

    const classes = [];
    for (let route of routes) {
      let currentPath = route.name.replace(/\./g, '/');

      if (podNames[currentPath]) {
        getOwner(this).lookup(`controller:${route.name}`).set('namespacedClass', podNames[currentPath]);
        classes.push(podNames[currentPath]);
      }
    }

    getOwner(this).lookup('controller:application').set('namespacedClassList', classes.join(' '));
  }
});

export function initialize() {}

export default {
  name: 'route-styles',
  initialize
};
