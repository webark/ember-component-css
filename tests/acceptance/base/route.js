import { visit } from '@ember/test-helpers';
import { test } from 'qunit';

export default function(type) {
  test('route style followed', async function(assert) {
    await visit(`/${type}`);

    const color = this.styleFor(`div[class*="__${type}"]`).color;
    assert.equal(color, 'rgb(0, 1, 0)');
  });

  test('nested route style followed', async function(assert) {
    await visit(`/${type}/nested`);

    const color = this.styleFor(`div[class*="__${type}__nested"]`).color;
    assert.equal(color, 'rgb(0, 2, 0)');
  });
}
