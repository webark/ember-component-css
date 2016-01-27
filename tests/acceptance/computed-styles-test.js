import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';
import Environment from 'dummy/config/environment';

var application;

module('Acceptance - Computed Styles', {
  beforeEach: function() {
    application = startApp();
    application.registry.optionsForType('expectation', { instantiate: false });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function lookup(app, thing) {
  if (app.lookup) return app.lookup(thing);
  if (app.__container__) return app.__container__.lookup(thing);

  return app.registry.lookup(thing);
}

Environment.ACCEPTANCE_TESTS.forEach(function(name) {
  test(name, function(assert) {
    visit('/acceptance/' + name);

    andThen(function() {
      var $root = Ember.$(application.rootElement);

      // Look up the expected styles for this test
      var expectation = lookup(application, 'expectation:acceptance/tests/' + name);
      var selectors = Object.keys(expectation.styles);

      // Locate each element with an expected set of styles, and assert that it matches those styles
      selectors.forEach(function(selector) {
        var expectedStyles = expectation.styles[selector];
        var selectorMatches = $root.find(selector);

        // Ensure we're only working against a single element
        if (selectorMatches.length !== 1) {
          throw new Error('Invalid test: `' + selector + '` matches ' + selectorMatches.length + ' elements.');
        }

        // Calculate the styles applied to the given element, and then pluck the ones we care about
        var computedStyles = window.getComputedStyle(selectorMatches[0]);
        var interestingStyles = Ember.getProperties(computedStyles, Object.keys(expectedStyles));

        assert.deepEqual(interestingStyles, expectedStyles);
      });
    });
  });
});
