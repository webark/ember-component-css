import { visit, currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | error state', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('handled error state does not throw', async function(assert) {
    await visit('/error-state/handled');
    assert.equal(currentURL(), '/error-state');
    assert.equal(this.styleFor('h1').color, 'rgb(0, 0, 14)');
  });
});
