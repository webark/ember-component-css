import Ember from 'ember';
import podNames from 'ember-component-css/pod-names';
import StyleNamespacingExtras from '../mixins/style-namespacing-extras';

const {
  Component,
  ComponentLookup,
  computed,
  getOwner
} = Ember;

export function initialize() {
  console.log('initialize ember-component-css', this);
  ComponentLookup.reopen({
    componentFor(name, owner) {
      owner = owner.hasRegistration ? owner : getOwner(this);

      if (podNames[name] && !owner.hasRegistration(`component:${name}`)) {
        owner.register(`component:${name}`, Component);
      }
      return this._super(...arguments);
    }
  });

  Component.reopen(StyleNamespacingExtras, {
    componentCssClassName: computed({
      get() {
        return podNames[this.get('_componentIdentifier')] || '';
      }
    }),

    init() {
      console.log('init component',
        this.get('_shouldAddNamespacedClassName'),
        this.get('componentCssClassName'),
        this.get('_componentIdentifier'),
        this,
        podNames
      );
      this._super(...arguments);
      if (this.get('_shouldAddNamespacedClassName')) {
        this.classNames = this.classNames.concat(this.get('componentCssClassName'));
      }
    }
  });
}

export default {
  name: 'component-styles',
  initialize
};
