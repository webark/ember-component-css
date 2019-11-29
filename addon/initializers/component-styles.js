import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import podNames from 'ember-component-css/pod-names';

Component.reopen({
  _componentIdentifier: computed({
    get() {
      return (this._debugContainerKey || '').replace('component:', '');
    }
  }),

  _shouldAddNamespacedClassName: computed({
    get() {
      return this.get('tagName') !== '' && this.get('styleNamespace');
    }
  }),

  styleNamespace: computed({
    get() {
      let fromLayout = this._tryComponentName(this.get('layout.referrer.moduleName'));
      let componentId = this.get('_componentIdentifier');
      return podNames[fromLayout || componentId] || '';
    }
  }),

  // componentCssClassName: deprecatingAlias('styleNamespace', {
  //   id: 'ember-component-css.deprecate-componentCssClassName',
  //   until: '0.7.0',
  // }),

  componentCssClassName: alias('styleNamespace'),

  init() {
    this._super(...arguments);

    if (this.get('_shouldAddNamespacedClassName')) {
      this.classNames = this.classNames.concat(this.get('styleNamespace'));
    }
  },

  _tryComponentName(modulePath) {
    if(!modulePath) {
      return;
    }
    let terminator = 'components/';
    let pathSegementToRemove = /.+\/components\//;
    modulePath = modulePath.replace(/\.\w+$/, '');
    
    modulePath = modulePath.substr(modulePath.lastIndexOf(terminator) + terminator.length ).replace(pathSegementToRemove, '')
    modulePath = modulePath.replace(/\/template/, '');

    return modulePath;
  }
});

export function initialize() {}

export default {
  initialize
};
