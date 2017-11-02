import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const TYPE = 'css';

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
