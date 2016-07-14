import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const TYPE = 'styl';

moduleForAcceptance('Acceptance | ' + TYPE);

test('base rule followed', function(assert) {
  visit('/' + TYPE);

  andThen(function() {
    assert.equal(find('.base').css('color'), 'rgb(0, 0, 1)');
  });
});

test('nested rule followed', function(assert) {
  visit('/' + TYPE);

  andThen(function() {
    assert.equal(find('.nested').css('color'), 'rgb(0, 0, 2)');
  });
});

test('non class nested rule followed', function(assert) {
  visit('/' + TYPE);

  andThen(function() {
    assert.equal(find('span span span').css('color'), 'rgb(0, 0, 3)');
  });
});

test('BES rule followed', function(assert) {
  visit('/' + TYPE);

  andThen(function() {
    assert.equal(find('.base-bes').css('color'), 'rgb(0, 0, 4)');
  });
});

test('BES variant rule followed', function(assert) {
  visit('/' + TYPE);

  andThen(function() {
    assert.equal(find('.base-bes_variant').css('color'), 'rgb(0, 0, 5)');
  });
});
