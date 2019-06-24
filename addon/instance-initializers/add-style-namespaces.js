import addRouteStyleNamespace from 'ember-component-css/utils/add-route-style-namespace';
import addComponentStyleNamespace from 'ember-component-css/utils/add-component-style-namespace';


export function initialize(appInstance) {
  let router = appInstance.lookup('service:router');
  router.on('routeDidChange', function({ to }) {
    if (likeRouteInfo(to)) {
      addRouteStyleNamespace(appInstance, nestedRouteNames(to));
    }
  });

  router.on('routeWillChange', function({ to, isActive }) {
    if (likeRouteInfo(to)) {
      if (/_loading$/.test(to.name) && isActive) {
        const routeNames = nestedRouteNames(to)
          // loading route names are set with an _loading even though
          // their path is -loading
          .map(name => name.replace(/_loading$/, '-loading'));
        addRouteStyleNamespace(appInstance, routeNames);
      }
    }
  });

  addComponentStyleNamespace(appInstance);
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
}
