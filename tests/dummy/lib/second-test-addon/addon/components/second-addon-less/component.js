import Component from '@ember/component';

import layout from './template';
import { styleNamespace } from './styles.less';

export default Component.extend({
  classNameBindings: ['styleNamespace'],
  styleNamespace,
  layout,
});
