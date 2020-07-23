import { modifier } from 'ember-modifier';

export default modifier(function styleNamespace(element, classAppends = [], { buildClass, argsClass, runClass }) {
  const mainClassNmae = argsClass || runClass || buildClass;
  const className = [mainClassNmae, ...classAppends].join('');

  element.classList.add(className);
});
