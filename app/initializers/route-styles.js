import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

const {
  Route,
  computed
} = Ember;

Route.reopen(StyleNamespacingExtras, {
  routeCssClassName: computed({
    get() {
      return podNames[this.get('_routeIdentifier')] || '';
    }
  }),

  activate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      document.querySelector('.ember-application').classList.add(this.get('routeCssClassName'));
    }
  },

  deactivate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      document.querySelector('.ember-application').classList.remove(this.get('routeCssClassName'));
    }
  }
});

export function initialize() {}

export default {
  name: 'route-styles',
  initialize
};
