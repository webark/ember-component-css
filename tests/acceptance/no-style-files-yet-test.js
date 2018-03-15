import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | no style files yet', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('should not have to include a style file inorder to build and render', async function(assert) {
    await visit('/no-style-files-yet');

    assert.equal(this.styleFor('.base').color, 'rgb(0, 0, 0)');
  });
});
