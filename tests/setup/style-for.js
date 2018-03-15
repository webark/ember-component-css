export default function(hooks) {
  hooks.beforeEach(function() {
    this.styleFor = (cssSelector) => window.getComputedStyle(this.element.querySelector(cssSelector));
  });
}
