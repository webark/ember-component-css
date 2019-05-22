import addRouteStyleNamespace from 'ember-component-css/utils/add-route-style-namespace';
import addComponentStyleNamespace from 'ember-component-css/utils/add-component-style-namespace';

export function initialize(appInstance) {
  const router = appInstance.lookup('service:router');
  router.on('routeDidChange', function(transition) {
    addRouteStyleNamespace(appInstance, transition.to.name.split('.'));
  });

  router.on('routeWillChange', function(transition) {
    if (/loading$/.test(transition.to.name) && transition.isActive) {
      addRouteStyleNamespace(appInstance, transition.to.name.split('.'));
    }
  });

  addComponentStyleNamespace(appInstance);
}

export default {
  initialize
};
