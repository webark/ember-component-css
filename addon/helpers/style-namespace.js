import Helper from '@ember/component/helper';

export default class StyleNamespace extends Helper {
  compute([ styleNamespace ]) {
    return styleNamespace;
  }
}