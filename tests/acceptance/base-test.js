import { module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

import basic from './base/basic';
import bem from './base/bem';
import route from './base/route';

const STYLE_TYPES = [
  'css',
  'less',
  'styl',
  'sass',
  'scss',
];

const ADDON_TYPES = [
  'less',
  'scss',
];

module(`Acceptance`, function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  for (let type of STYLE_TYPES) {
    module(type, function() {
      basic.call(this, type);
      bem.call(this, type);
      route.call(this, type);
    });
  }

  for (let type of ADDON_TYPES) {
    module(`${type} Addon`, function() {
      basic.call(this, `addon/${type}`);
      bem.call(this, `addon/${type}`);
    });
  }
});
