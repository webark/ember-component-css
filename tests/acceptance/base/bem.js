import { visit } from '@ember/test-helpers';
import { test } from 'qunit';

export default function(type) {
  test('BEM rule followed', async function(assert) {
    await visit(`/${type}`);

    const color = this.styleFor('[class$=__element]').color;
    assert.equal(color, 'rgb(0, 0, 4)');
  });

  test('BEM variant rule followed', async function(assert) {
    await visit(`/${type}`);

    const color = this.styleFor('[class$=__element--variant]').color;
    assert.equal(color, 'rgb(0, 0, 5)');
  });
}
