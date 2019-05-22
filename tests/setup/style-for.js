import { find } from '@ember/test-helpers';

export default function(hooks) {
  hooks.beforeEach(function() {
    this.styleFor = (cssSelector) => window.getComputedStyle(find(cssSelector));
  });
}
