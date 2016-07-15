import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | template style only');

test('should be able to use a pod style with only the style file and a template', function(assert) {
  visit('/template-style-only');

  andThen(function() {
    assert.equal(find('.template-only').css('color'), 'rgb(0, 0, 1)');
  });
});
