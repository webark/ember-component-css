import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

const {
  A,
  Route,
  computed,
  getOwner
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
      let controller = this.controllerFor('application');
      let routeCssClassName = controller.getWithDefault('routeCssClassName', '');

      controller.set('routeCssClassName', `${routeCssClassName} ${this.get('routeCssClassName')}`);
    }
  },

  deactivate() {
    this._super(...arguments);

    if (this.get('routeCssClassName')) {
      let controller = this.controllerFor('application');
      let routeCssClassName = controller.getWithDefault('routeCssClassName', '');

      controller.set('routeCssClassName', routeCssClassName.replace(this.get('routeCssClassName'), ''));
    }
  }
});

export function initialize() {}

export default {
  name: 'route-styles',
  initialize
};
