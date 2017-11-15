import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const TYPE = 'scss';

moduleForAcceptance(`Acceptance | ${TYPE}`);

test('base rule followed', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    assert.equal(find('.base').css('color'), 'rgb(0, 0, 1)');
  });
});

test('nested rule followed', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    assert.equal(find('.nested').css('color'), 'rgb(0, 0, 2)');
  });
});

test('non class nested rule followed', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    assert.equal(find('span span span').css('color'), 'rgb(0, 0, 3)');
  });
});

test('BEM rule followed', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    assert.equal(find('[class$=__element]').css('color'), 'rgb(0, 0, 4)');
  });
});

test('BEM variant rule followed', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    assert.equal(find('[class$=__element--variant]').css('color'), 'rgb(0, 0, 5)');
  });
});

test('mixin psudo elements do not get scoped', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    let item = find('[class$=__element--variant]');
    item.addClass('mixin-extra');
    assert.equal(item.css('color'), 'rgb(0, 0, 6)');
  });
});

test('children of root @for rules are namspaced', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    for (let index of Array(10).keys()) {
      let item = find(`[class$=__element--${index}]`);
      assert.equal(item.css('color'), `rgb(0, 0, ${index})`);
    }
  });
});

test('route style followed', function(assert) {
  visit(`/${TYPE}`);

  andThen(function() {
    assert.equal(find(`div[class^="__${TYPE}"]`).css('color'), 'rgb(0, 1, 0)');
  });
});

test('nested route style followed', function(assert) {
  visit(`/${TYPE}/nested`);

  andThen(function() {
    assert.equal(find(`div[class*="__${TYPE}__nested"]`).css('color'), 'rgb(0, 2, 0)');
  });
});
