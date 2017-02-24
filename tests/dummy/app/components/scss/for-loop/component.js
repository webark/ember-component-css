import Ember from 'ember';

const {
  Component,
} = Ember;

export default Component.extend({
  items: [...Array(10).keys()],
});
