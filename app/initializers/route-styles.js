import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

const {
  $,
  Route
} = Ember;

Route.reopen(StyleNamespacingExtras, {
  activate() {
    this._super(...arguments);

    $('body').addClass(podNames[this.get('_componentIdentifier').replace('route:', '')] || '');
  },

  deactivate() {
    this._super(...arguments);

    $('body').removeClass(podNames[this.get('_componentIdentifier').replace('route:', '')] || '');
  }
});

export function initialize() {}

export default {
  name: 'route-styles',
  initialize
};
