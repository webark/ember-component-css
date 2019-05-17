import initRouteStyles from '../utils/init-route-styles';

// This file is removed from the build in Ember < 3.6
export function initialize(appInstance) {
  let router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    let routeInfos = [];
    let to = transition.to;

    while (to) {
      routeInfos.push(to);
      to = to.parent;
    }

    routeInfos.reverse();

    if (routeInfos.length === 0) {
      routeInfos = transition.routeInfos;
    }

    initRouteStyles(appInstance, routeInfos);
  });
}

export default {
  initialize
};
