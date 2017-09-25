import $ from 'jquery';
import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

const {
  Route,
  computed,
  getOwner
} = Ember;

Route.reopen(StyleNamespacingExtras, {
  appRoot: computed({
    get() {
      const rootSelector = Ember.testing
        ? '#ember-testing'
        : getOwner(this).lookup('application:main').rootElement;

      return self.document.querySelector(rootSelector);
    }
  }),

  routeCssClassName: computed({
    get() {
      return podNames[this.get('_routeIdentifier')] || '';
    }
  }),

  activate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      this.get('appRoot').setAttribute(
        'class',
        `${this.get('appRoot').getAttribute('class') || ''} ${this.get('routeCssClassName')}`
      );
    }
  },

  deactivate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      this.get('appRoot').setAttribute(
        'class',
        this.get('appRoot').getAttribute('class').replace(this.get('routeCssClassName'), '')
      );
    }
  }
});

export function initialize() {}

export default {
  name: 'route-styles',
  initialize
};
