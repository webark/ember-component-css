import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

module('Acceptance | template style only', function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('should be able to use a pod style with only the style file and a template', async function(assert) {
    await visit('/template-style-only');

    assert.equal(this.styleFor(`[class$=__template-only]`).color, 'rgb(0, 0, 1)');
  });
});
