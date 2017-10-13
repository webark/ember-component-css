import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

const {
  A,
  Route,
  Controller,
  computed,
  getOwner
} = Ember;

Controller.reopen({
  routeCssClassName: computed({
    get() {
      return this.get('routeCssClassNames').join(' ');
    }
  }),

  routeCssClassNames: undefined,

  init() {
    this._super(...arguments);

    this.set('routeCssClassNames', A([]));
  }
});

Route.reopen(StyleNamespacingExtras, {
  routeCssClassName: computed({
    get() {
      return podNames[this.get('_routeIdentifier')] || '';
    }
  }),

  activate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      let controller = this.controllerFor('application');
      controller.get('routeCssClassNames').pushObject(this.get('routeCssClassName'));
    }
  },

  deactivate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      let controller = this.controllerFor('application');
      controller.set('routeCssClassNames', controller.get('routeCssClassNames').without(this.get('routeCssClassName')));
    }
  }
});

export function initialize() {}

export default {
  name: 'route-styles',
  initialize
};
