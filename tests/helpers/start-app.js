import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

const {
  merge,
  run,
} = Ember;

export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  // let attributes = Ember.assign({}, config.APP, attrs);
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs);

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
