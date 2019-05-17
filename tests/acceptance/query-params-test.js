import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance(`Acceptance | query params`);

test('route style with query params', function(assert) {
  visit(`/query-params`);

  andThen(function() {
    assert.equal(find(`div[class^="__query-params"]`).css('color'), 'rgb(0, 1, 0)');

    click('a.foo-bar');

    andThen(function() {
      assert.equal(currentURL(), '/query-params?foo=bar');
      assert.equal(find(`div[class^="__query-params"]`).css('color'), 'rgb(0, 1, 0)');
    });
  });
});
