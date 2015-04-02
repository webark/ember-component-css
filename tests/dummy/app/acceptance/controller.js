import Ember from 'ember';

export default Ember.Controller.extend({
  componentPath: Ember.computed('model.component', function() {
    return 'acceptance/tests/' + this.get('model.component');
  })
});
