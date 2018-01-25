import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  _componentIdentifier: computed({
    get() {
      return (this._debugContainerKey || '').replace('component:', '');
    }
  }),

  _shouldAddNamespacedClassName: computed({
    get() {
      return this.get('tagName') !== '' && this.get('styleNamespace');
    }
  }),
});
