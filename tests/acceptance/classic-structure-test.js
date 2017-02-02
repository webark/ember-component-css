import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | classic structure');

test('should be able to use classic structure style', function(assert) {
  visit('/classic-structure');

  andThen(function() {
    assert.equal(find('.classic-structure').css('color'), 'rgb(0, 0, 1)');
  });
});

test('should be able to use classic structure style nested', function(assert) {
  visit('/classic-structure-nested');

  andThen(function() {
    assert.equal(find('.classic-structure-nested').css('color'), 'rgb(0, 0, 1)');
  });
});
