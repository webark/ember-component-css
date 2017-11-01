import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
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
  this.route('classic-structure');
  this.route('classic-structure-nested');
  this.route('unique-component-paths');

  this.route('addon', function() {
    this.route('scss');
    this.route('less');
  });
});

export default Router;
