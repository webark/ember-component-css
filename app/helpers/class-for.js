import Ember from 'ember';

export function classFor(input) {
  var key = this._debugContainerKey.replace('component:', '');
  return Ember.COMPONENT_CSS_LOOKUP[key] + '-' + input;
}

export default Ember.HTMLBars.makeBoundHelper(classFor);
