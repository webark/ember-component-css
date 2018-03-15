import { visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | classic structure', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  skip('should be able to use classic structure style', async function(assert) {
    await visit('/classic-structure');

    const color = this.styleFor('.classic-structure').color;
    assert.equal(color, 'rgb(0, 0, 1)');
  });

  skip('should be able to use classic structure style nested', async function(assert) {
    await visit('/classic-structure-nested');

    const color = this.styleFor('.classic-structure-nested').color;
    assert.equal(color, 'rgb(0, 0, 1)');
  });
});
