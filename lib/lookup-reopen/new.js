Ember.ComponentLookup.reopen({
  _lookupFactory: function(name, owner) {
    owner = owner || Ember.getOwner(this);
    debugger;
    var Component = this._super(name, owner);
    if (!Component) { return; }
    name = name.replace(".","/");
    if (Component.prototype.classNames.indexOf(Ember.COMPONENT_CSS_LOOKUP[name]) > -1){
      return Component;
    }
    return Component.reopen({
      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]
    });
  },

  componentFor: function(name, owner, options) {
    debugger;
    var Component = this._super(name, owner);
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