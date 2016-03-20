Ember.ComponentLookup.reopen({
  lookupFactory: function(name) {
    var Component = this._super.apply(this, arguments);

    if (!Component) { return; }

    name = name.replace(".","/");
    if (Component.prototype.classNames.indexOf(Ember.COMPONENT_CSS_LOOKUP[name]) > -1){
      return Component;
    }

    return Component.reopen({
      classNames: [Ember.COMPONENT_CSS_LOOKUP[name]]
    });
  },

  componentFor: function(name) {
    var Component = this._super.apply(this, arguments);

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
