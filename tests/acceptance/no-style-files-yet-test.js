import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | no style files yet');

test('should not have to include a style file inorder to build and render', function(assert) {
  visit('/no-style-files-yet');

  andThen(function() {
    assert.equal(find('.base').css('color'), 'rgb(0, 0, 0)');
  });
});
