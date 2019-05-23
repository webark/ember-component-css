import addRouteStyleNamespace from 'ember-component-css/utils/add-route-style-namespace';
import addComponentStyleNamespace from 'ember-component-css/utils/add-component-style-namespace';

export function initialize(appInstance) {
  const router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    addRouteStyleNamespace(appInstance, nestedRoutes(transition.to.name));
  });

  router.on('routeWillChange', function(transition) {
    if (/loading$/.test(transition.to.name) && transition.isActive) {
      addRouteStyleNamespace(appInstance, nestedRoutes(transition.to.name));
    }
  });

  addComponentStyleNamespace(appInstance);
}

function nestedRoutes(routeName) {
  return routeName.split('.').reduce(function(allRoutes, routePart) {
    return allRoutes.concat(allRoutes.slice(-1).concat(routePart).join('.'));
  }, []);
}

export default {
  initialize
};
