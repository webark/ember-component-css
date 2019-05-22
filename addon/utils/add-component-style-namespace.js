export default function addComponentStyleNamespace(owner) {
  const styles = owner.lookup('container-debug-adapter:main').catalogEntriesByType('styles');

  for (const stylePath of styles) {
    const component = owner.lookup(`component:${stylePath}`);
    const styleInfo = owner.lookup(`styles:${stylePath}`);

    if (component && styleInfo) {
      const proto = Object.getPrototypeOf(component);

      if (!component.styleNamespace) {
        proto.styleNamespace = styleInfo.styleNamespace;
      }

      if (!component.classNameBindings.includes('styleNamespace')) {
        proto.classNameBindings = component.classNameBindings.concat('styleNamespace');
      }
    }

    // else {
    //   console.log(stylePath);
    // }
  }
}
