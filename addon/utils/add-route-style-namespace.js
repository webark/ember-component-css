const ROUTE_CLASS_SET_PROPERTY_NAME = 'routeStyleNamespaceClassSet';
const ROUTE_CLASS_SINGLE_PROPERTY_NAME = 'styleNamespace';

export default function addRouteStyleNamespace(owner, routeNames) {
  const classes = [];

  for (const name of routeNames) {
    const { styleNamespace } = owner.lookup(`styles:${name}`) || {};

    if (styleNamespace) {
      const controller = owner.lookup(`controller:${name}`);
      if (controller) {
        owner.lookup(`controller:${name}`).set(ROUTE_CLASS_SINGLE_PROPERTY_NAME, styleNamespace);
        classes.push(styleNamespace);
      }
    }
  }

  owner.lookup('controller:application').set(ROUTE_CLASS_SET_PROPERTY_NAME, classes.join(' '));
}
