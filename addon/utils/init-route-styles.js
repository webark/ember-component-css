import podNames from 'ember-component-css/pod-names';

export default function initRouteStyles(owner, routes) {
  const classes = [];
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    let currentPath = route.name.replace(/\./g, '/');

    if (podNames[currentPath]) {
      owner
        .lookup(`controller:${route.name}`)
        .set('styleNamespace', podNames[currentPath]);
      classes.push(podNames[currentPath]);
    }
  }

  owner
    .lookup('controller:application')
    .set('routeStyleNamespaceClassSet', classes.join(' '));
}
