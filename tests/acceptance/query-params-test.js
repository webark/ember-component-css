import { visit, click, currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | query params', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('route style with query params', async function(assert) {
    await visit('/query-params');

    assert.equal(this.styleFor('div[class*="__query-params"]').color, 'rgb(0, 1, 0)');

    await click('a.foo-bar');
    assert.equal(currentURL(), '/query-params?foo=bar');
    assert.equal(this.styleFor('div[class*="__query-params"]').color, 'rgb(0, 1, 0)');
  });
});
