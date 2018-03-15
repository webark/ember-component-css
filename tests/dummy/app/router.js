import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('css', function() {
    this.route('nested');
  });

  this.route('scss', function() {
    this.route('nested');
  });

  this.route('sass', function() {
    this.route('nested');
  });

  this.route('styl', function() {
    this.route('nested');
  });

  this.route('less', function() {
    this.route('nested');
  });

  this.route('template-style-only');
  this.route('no-style-files-yet');
  this.route('classic-structure');
  this.route('classic-structure-nested');
  this.route('unique-component-paths');

  this.route('addon', function() {
    this.route('scss');
    this.route('less');
  });
});

export default Router;
