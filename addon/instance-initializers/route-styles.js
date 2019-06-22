import initRouteStyles from '../utils/init-route-styles';

// This file is removed from the build in Ember < 3.6
export function initialize(appInstance) {
  let router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    initRouteStyles(appInstance, nestedRouteNames(transition.to));
  });

  router.on('routeWillChange', function(transition) {
    if (transition.to && /_loading$/.test(transition.to.name) && transition.isActive) {
      const routeNames = nestedRouteNames(transition.to)
        // loading route names are set with an _loading even though
        // their path is -loading
        .map(name => name.replace(/_loading$/, '-loading'));
      initRouteStyles(appInstance, routeNames);
    }
  });
}

function nestedRouteNames(route = {}, routeNames = []) {
  if (route.name) {
    routeNames.push(route.name);
  }

  if (route.parent) {
    return nestedRouteNames(route.parent, routeNames);
  }
  return routeNames;
}

export default {
  initialize
};
