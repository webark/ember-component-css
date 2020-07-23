import processStyleType from 'ember-component-css/utils/process-style-type';

export default function addComponentStyleNamespace(owner) {
  const styles = processStyleType(owner);

  for (const styleFullName of styles) {
    const component = owner.lookup(`component:${styleFullName}`);
    const { styleNamespace } = owner.lookup(`style:${styleFullName}`) || {};

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
