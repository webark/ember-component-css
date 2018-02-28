export { default, initialize } from 'ember-component-css/initializers/component-styles';

import Ember from 'ember';

import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

// eslint-disable-next-line ember/new-module-imports
Ember.Component.reopen(StyleNamespacingExtras);
