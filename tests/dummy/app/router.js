import Ember from 'ember';
import config from './config/environment';

const {
  Router,
} = Ember;

export default Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
}).map(function() {
  this.route('scss');
  this.route('sass');
  this.route('styl');
  this.route('less');
  this.route('css');

  this.route('template-style-only');
  this.route('no-style-files-yet');
  this.route('classic-structure');
  this.route('classic-structure-nested');

  this.route('addon', function() {
    this.route('scss');
    this.route('less');
  });
});
