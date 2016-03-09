import Ember from 'ember';
import ComponentStylesInitializer from 'dummy/initializers/component-styles';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | component styles', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ComponentStylesInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
