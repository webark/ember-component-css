import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  items: computed({
    get() {
      return [...Array(10).keys()];
    },
  }),
});
