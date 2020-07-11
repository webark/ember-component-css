export default function addRouteStyleNamespace(owner, routes) {
  const classes = [];

  for (const name of routes) {
    const { styleNamespace } = owner.lookup(`styles:${name}`) || {};
    const controller = owner.lookup(`controller:${name}`);

    if (styleNamespace && controller) {
      controller.set('styleNamespace', styleNamespace);
      classes.push(styleNamespace);
    }
  }

  if (owner.lookup('controller:application')) {
    owner.lookup('controller:application').set('routeStyleNamespaceClassSet', classes.join(' '));
  }
}
