import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import podNames from 'ember-component-css/pod-names';

function identifierFromLayoutModuleName(modulePath = '') {
  const terminator = 'components/';
  const pathSegementToRemove = /.+\/components\//;

  return modulePath.replace(/\.\w+$/, '')
    .substr(modulePath.lastIndexOf(terminator) + terminator.length )
    .replace(pathSegementToRemove, '')
    .replace(/\/template/, '');
}

function identifierFromDebugContainerKey(debugContainerKey = '') {
  return debugContainerKey.replace('component:', '');
}

Component.reopen({
  _componentIdentifier: computed({
    get() {
      return identifierFromLayoutModuleName(this.get('layout.referrer.moduleName')) || identifierFromDebugContainerKey(this._debugContainerKey);
    }
  }),

  _shouldAddNamespacedClassName: computed({
    get() {
      return this.get('tagName') !== '' && this.get('styleNamespace');
    }
  }),

  styleNamespace: computed({
    get() {
      return podNames[this.get('_componentIdentifier')] || '';
    }
  }),

  componentCssClassName: alias('styleNamespace'),

  init() {
    this._super(...arguments);

    if (this.get('_shouldAddNamespacedClassName')) {
      this.classNames = this.classNames.concat(this.get('styleNamespace'));
    }
  },
});

export function initialize() {}

export default {
  initialize
};
