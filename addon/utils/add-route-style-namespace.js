const ROUTE_CLASS_SET_PROPERTY_NAME = 'routeStyleNamespaceClassSet';
const ROUTE_CLASS_SINGLE_PROPERTY_NAME = 'styleNamespace';

export default function addRouteStyleNamespace(owner, routeNames) {
  const classes = [];

  while (routeNames.length) {
    const name = routeNames.join('.');
    const { styleNamespace } = owner.lookup(`styles:${name}`) || {};

    if (styleNamespace) {
      const controller = owner.lookup(`controller:${name}`);

      if (controller) {
        controller.set(ROUTE_CLASS_SINGLE_PROPERTY_NAME, styleNamespace);
        classes.push(styleNamespace);
      }
    }

    routeNames.pop();
  }

  owner.lookup('controller:application').set(ROUTE_CLASS_SET_PROPERTY_NAME, classes.join(' '));
}
