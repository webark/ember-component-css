import { skip } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance(`Acceptance | unique component paths`);

skip('base rule followed', function(assert) {
  visit(`/unique-component-paths`);

  andThen(function() {
    assert.equal(find('h1').css('color'), 'rgb(0, 0, 14)');
  });
});
