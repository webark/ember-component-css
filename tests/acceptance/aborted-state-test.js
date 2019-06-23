import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | aborted state');

test('when aborting it should finish the transition and not error', function(assert) {
  visit('/aborted-state');


  andThen(function() {
    assert.equal(currentURL(), '/template-style-only');
  });
});
