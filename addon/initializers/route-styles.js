import Router from '@ember/routing/router';
import { getOwner } from '@ember/application';
import initRouteStyles from '../utils/init-route-styles';

// This file is removed from the build in Ember 3.6+
Router.reopen({
  didTransition(routes) {
    this._super(...arguments);
    initRouteStyles(getOwner(this), routes);
  }
});

export function initialize() {}

export default {
  initialize
};
