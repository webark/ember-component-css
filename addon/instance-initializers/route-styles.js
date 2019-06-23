import initRouteStyles from '../utils/init-route-styles';

// This file is removed from the build in Ember < 3.6
export function initialize(appInstance) {
  let router = appInstance.lookup('service:router');
  router.on('routeDidChange', function({ to }) {
    if (likeRouteInfo(to)) {
      initRouteStyles(appInstance, nestedRouteNames(to));
    }
  });

  router.on('routeWillChange', function({ to, isActive }) {
    if (likeRouteInfo(to)) {
      if (/_loading$/.test(to.name) && isActive) {
        const routeNames = nestedRouteNames(to)
          // loading route names are set with an _loading even though
          // their path is -loading
          .map(name => name.replace(/_loading$/, '-loading'));
        initRouteStyles(appInstance, routeNames);
      }
    }
  });
}

function nestedRouteNames({ name, parent }, routeNames = []) {
  routeNames.push(name);
  if (parent) {
    return nestedRouteNames(parent, routeNames);
  }
  return routeNames;
}

function likeRouteInfo(info) {
  return info && typeof info === 'object' && info.hasOwnProperty('name');
}

export default {
  initialize
};
