import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(transition) {
    transition.abort();
    this.transitionTo('css.nested');
  }
});
