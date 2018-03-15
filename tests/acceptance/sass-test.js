import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

const TYPE = 'sass';

module(`Acceptance | ${TYPE}`, function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('mixin psudo elements do not get scoped', async function(assert) {
    await visit(`/${TYPE}`);

    let element = this.element.querySelector('[class$=__element--variant]');
    element.classList.add('mixin-extra');
    assert.equal(window.getComputedStyle(element).color, 'rgb(0, 0, 6)');
  });
});
