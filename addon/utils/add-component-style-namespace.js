export default function addComponentStyleNamespace(owner) {
  const styles = owner.lookup('container-debug-adapter:main').catalogEntriesByType('style');

  for (const stylePath of styles) {
    const component = owner.lookup(`component:${stylePath}`);
    const { styleNamespace } = owner.lookup(`style:${stylePath}`) || {};

    if (styleNamespace && component) {
      const proto = Object.getPrototypeOf(component);

      if (!component.styleNamespace) {
        proto.styleNamespace = styleNamespace;
      }

      if (!component.classNameBindings.includes('styleNamespace')) {
        proto.classNameBindings = component.classNameBindings.concat('styleNamespace');
      }
    }
  }
}
