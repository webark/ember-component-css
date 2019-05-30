import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return new RSVP.Promise(resolve => later(resolve, 500));
  }
});
