const ROUTE_CLASS_SET_PROPERTY_NAME = 'routeStyleNamespaceClassSet';
const ROUTE_CLASS_SINGLE_PROPERTY_NAME = 'styleNamespace';

export default function initRouteStyles(owner, routes) {
  const classes = [];

  for (const { name } of routes) {
    const { styleNamespace } = owner.lookup(`style-info:${name}`) || {};

    if (styleNamespace) {
      owner.lookup(`controller:${name}`).set(ROUTE_CLASS_SINGLE_PROPERTY_NAME, styleNamespace);
      classes.push(styleNamespace);
    }
  }

  owner.lookup('controller:application').set(ROUTE_CLASS_SET_PROPERTY_NAME, classes.join(' '));
}
