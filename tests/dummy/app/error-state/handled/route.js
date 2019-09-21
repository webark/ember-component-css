import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return new RSVP.Promise.reject();
  },

  actions: {
    error() {
      this.transitionTo('error-state');
    }
  }
});
