import { visit, currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | aborted state', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('should still render for aborted stte', async function(assert) {
    await visit('/css/aborted-state');

    assert.equal(currentURL(), '/css/nested');
    assert.equal(this.styleFor('[class$=__nested]').color, 'rgb(0, 2, 0)');
  });
});
