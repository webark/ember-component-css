import Ember from 'ember';

const {
  computed,
  Mixin,
} = Ember;

export default Mixin.create({
  _componentIdentifier: computed({
    get() {
      return (this._debugContainerKey || '').replace('component:', '');
    }
  }),

  _shouldAddNamespacedClassName: computed({
    get() {
      return this.get('tagName') !== '' && this.get('componentCssClassName');
    }
  }),
});
