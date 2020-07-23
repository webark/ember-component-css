import Component from '@ember/component';

import layout from './template';
import { styleNamespace } from './styles.scss';

export default Component.extend({
  classNameBindings: ['styleNamespace'],
  styleNamespace,
  layout,
});
