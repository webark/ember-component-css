import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { scheduleOnce } from '@ember/runloop';

moduleForAcceptance(`Acceptance | Unique Paths`);

test('loading state is styled', function(assert) {
  visit(`/loading-state/base`);

  andThen(function() {
    click(find('a'));
    assert.equal(find('h1').css('color'), 'rgb(0, 0, 14)');

    scheduleOnce('afterRender', function() {
      assert.equal(find('h2').css('color'), 'rgb(1, 0, 13)');
    });

  });

  andThen(function() {
    assert.equal(find('h3').css('color'), 'rgb(0, 0, 13)');
  })
});
