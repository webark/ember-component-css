import { visit, click } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { scheduleOnce } from '@ember/runloop';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | loading state', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('loading state is styled', async function(assert) {
    await visit('/loading-state/base');
    assert.equal(this.styleFor('h1').color, 'rgb(0, 0, 14)');
    const tranitionCLick = click('a[title=Waiting]');
    function loadingCheck() {
      assert.equal(this.styleFor('h2').color, 'rgb(1, 0, 13)');
    }
    scheduleOnce('afterRender', this, loadingCheck);
    await tranitionCLick;
    assert.equal(this.styleFor('h3').color, 'rgb(0, 0, 13)');
  });
});
