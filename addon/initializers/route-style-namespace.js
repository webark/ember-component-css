import Router from '@ember/routing/router';
import { getOwner } from '@ember/application';

Router.reopen({
  didTransition(routes) {
    this._super(...arguments);

    const classes = [];
    for (let route of routes) {
      let styleInfo = getOwner(this).lookup(`style-info:${route.name}`);
      if (styleInfo) {
        let styleNamespace = styleInfo.get('styleNamespace');
        getOwner(this).lookup(`controller:${route.name}`).set('styleNamespace', styleNamespace);
        classes.push(styleNamespace);
      }
    }

    getOwner(this).lookup('controller:application').set('routeStyleNamespaceClassSet', classes.join(' '));
  }
});

export default {
  initialize: function() {},
};
