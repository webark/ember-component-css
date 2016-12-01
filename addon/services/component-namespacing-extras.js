import Ember from 'ember';

const {
  Service,
} = Ember;

export default Service.extend({
  componentIdentifier(_debugContainerKey) {
    return (_debugContainerKey || '').replace('component:', '');
  }
});
