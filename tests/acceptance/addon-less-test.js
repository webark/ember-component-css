import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const TYPE = 'less';
const PATH = `/addon/${TYPE}`;

moduleForAcceptance(`Acceptance | Addon for ${TYPE}`);

test('base rule followed', function(assert) {
  visit(PATH);

  andThen(function() {
    assert.equal(find('.base').css('color'), 'rgb(1, 0, 1)');
  });
});

test('nested rule followed', function(assert) {
  visit(PATH);

  andThen(function() {
    assert.equal(find('.nested').css('color'), 'rgb(1, 0, 2)');
  });
});

test('non class nested rule followed', function(assert) {
  visit(PATH);

  andThen(function() {
    assert.equal(find('span span span').css('color'), 'rgb(1, 0, 3)');
  });
});

test('BEM rule followed', function(assert) {
  visit(PATH);

  andThen(function() {
    assert.equal(find('[class$=__element]').css('color'), 'rgb(1, 0, 4)');
  });
});

test('BEM variant rule followed', function(assert) {
  visit(PATH);

  andThen(function() {
    assert.equal(find('[class$=__element--variant]').css('color'), 'rgb(1, 0, 5)');
  });
});
