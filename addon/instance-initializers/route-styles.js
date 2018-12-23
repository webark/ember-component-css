import podNames from 'ember-component-css/pod-names';

// This file is removed from the build in Ember < 3.6
export function initialize(appInstance) {
  let router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    const routes = transition.routeInfos;
    const classes = [];
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];
      let currentPath = route.name.replace(/\./g, '/');

      if (podNames[currentPath]) {
        appInstance
          .lookup(`controller:${route.name}`)
          .set('styleNamespace', podNames[currentPath]);
        classes.push(podNames[currentPath]);
      }
    }

    appInstance
      .lookup('controller:application')
      .set('routeStyleNamespaceClassSet', classes.join(' '));

  });
}

export default {
  initialize
};
