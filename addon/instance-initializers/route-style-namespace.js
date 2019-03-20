import initRouteStyles from 'ember-component-css/utils/init-route-styles';

export function initialize(appInstance) {
  const router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    initRouteStyles(appInstance, transition.routeInfos);
  });
}

export default {
  initialize
};
