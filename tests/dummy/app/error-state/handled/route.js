import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return new RSVP.Promise((_resolve, reject) => later(reject));
  },

  actions: {
    error() {
      this.transitionTo('error-state');
    }
  }
});
