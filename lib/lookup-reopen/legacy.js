Ember.ComponentLookup.reopen({
  lookupFactory: function(name, container) {
    var Component = this._super(name, container);
    if (!Component) { return; }
    name = name.replace(".","/");
    if (Component.prototype.classNames.indexOf(Ember.COMPONENT_CSS_LOOKUP[name]) > -1){
      return Component;
    }
    return Component.reopen({
      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]
    });
  },

  componentFor: function(name, container) {
    var Component = this._super(name, container);
    if (!Component) { return; }
    name = name.replace(".","/");
    if (Component.prototype.classNames.indexOf(Ember.COMPONENT_CSS_LOOKUP[name]) > -1){
      return Component;
    }
    return Component.reopen({
      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]
    });
  }
});