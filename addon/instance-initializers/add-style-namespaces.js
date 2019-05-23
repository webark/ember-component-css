import addRouteStyleNamespace from 'ember-component-css/utils/add-route-style-namespace';
import addComponentStyleNamespace from 'ember-component-css/utils/add-component-style-namespace';

export function initialize(appInstance) {
  const router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    addRouteStyleNamespace(appInstance, nestedRoutes(transition.to));
  });

  router.on('routeWillChange', function(transition) {
    if (/loading$/.test(transition.to.name) && transition.isActive) {
      addRouteStyleNamespace(appInstance, nestedRoutes(transition.to));
    }
  });

  addComponentStyleNamespace(appInstance);
}

function nestedRoutes(route, routeNames = []) {
  routeNames.push(route.name);
  if (route.parent) {
    return nestedRoutes(route.parent, routeNames);
  }
  return routeNames;
}

export default {
  initialize
};
