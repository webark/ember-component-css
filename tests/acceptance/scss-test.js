import { visit, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import styleForSetup from 'dummy/tests/setup/style-for';

const TYPE = 'scss';

module(`Acceptance | ${TYPE}`, function(hooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('mixin psudo elements do not get scoped', async function(assert) {
    await visit(`/${TYPE}`);

    const element = find('[class$=__element--variant]');
    element.classList.add('mixin-extra');
    assert.equal(window.getComputedStyle(element).color, 'rgb(0, 0, 6)');
  });

  test('children of root @for rules are namspaced', async function(assert) {
    await visit(`/${TYPE}`);

    for (const index of Array(10).keys()) {
      const color = this.styleFor(`[class$=__element--${index}]`).color
      assert.equal(color, `rgb(0, 0, ${index})`);
    }
  });
});
