import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('scss');
  this.route('sass');
  this.route('styl');
  this.route('less');
  this.route('css');

  this.route('template-style-only');
  this.route('no-style-files-yet');

  this.route('addon', function() {
    this.route('scss');
    this.route('less');
  });
});

export default Router;
