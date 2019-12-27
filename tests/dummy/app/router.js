import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('css', function() {
    this.route('nested');
    this.route('aborted-state');
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
  this.route('query-params');

  this.route('addon', function() {
    this.route('scss');
    this.route('less');
  });

  this.route('loading-state', function() {
    this.route('base');
    this.route('waiting');
  });

  this.route('error-state', function() {
    this.route('handled');
  });

  this.route('aborted-state');
});
