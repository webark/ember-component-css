import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
  model() {
    return new Promise(resolve => later(resolve, 500));
  }
});
