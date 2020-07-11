import { find } from '@ember/test-helpers';
import { assert } from '@ember/debug';

export default function(hooks) {
  hooks.beforeEach(function() {
    this.styleFor = function styleFor(cssSelector) {
      const element = find(cssSelector);
      assert(`CSS selector of ${cssSelector} was unable find a type of Element.`, element instanceof Element);
      return window.getComputedStyle(element);
    };
  });
}
