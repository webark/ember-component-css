import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance(`Acceptance | error state`);

test('handled error state does not throw', function(assert) {
  visit(`/error-state/handled`);

  andThen(function() {
    assert.equal(currentURL(), '/error-state');
    assert.equal(find('h1').css('color'), 'rgb(0, 0, 14)');
  })
});
