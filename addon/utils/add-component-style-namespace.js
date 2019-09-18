
export default function addComponentStyleNamespace(owner) {
  const styles = owner.lookup('container-debug-adapter:main').catalogEntriesByType('styles');

  for (const stylePath of styles) {
    const component = owner.lookup(`component:${stylePath}`);
    const { styleNamespace } = owner.lookup(`styles:${stylePath}`) || {};

    if (styleNamespace && component) {
      const proto = Object.getPrototypeOf(component);

      if (!component.styleNamespace) {
        proto.styleNamespace = styleNamespace;
      }

      if (component.tagName !== '' && !component.classNameBindings.includes('styleNamespace')) {
        proto.classNameBindings = component.classNameBindings.concat('styleNamespace');
      }
    }
  }
}
