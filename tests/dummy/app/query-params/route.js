import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    foo: {
      refreshModel: true
    }
  }
});
