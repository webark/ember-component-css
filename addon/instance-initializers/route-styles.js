import initRouteStyles from '../utils/init-route-styles';

// This file is removed from the build in Ember < 3.6
export function initialize(appInstance) {
  let router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    initRouteStyles(appInstance, transition.routeInfos);
  });
}

export default {
  initialize
};
