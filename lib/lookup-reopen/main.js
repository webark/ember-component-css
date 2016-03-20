(function() {
  function componentHasBeenReopened(Component, className) {
    return Component.prototype.classNames.indexOf(className) > -1;
  }

  function reopenComponent(_Component, className) {
    var Component = _Component.reopen({
      classNames: [className]
    });

    return Component;
  }

  function ensureComponentCSSClassIncluded(_Component, _name) {
    var Component = _Component;
    var name = name.replace(".","/");
    var className = Ember.COMPONENT_CSS_LOOKUP[name];

    if (!componentHasBeenReopened(Component)) {
      Component = reopenComponent(Component, className);
    }

    return Component;
  }

  Ember.ComponentLookup.reopen({
    lookupFactory: function(name) {
      var Component = this._super.apply(this, arguments);

      if (!Component) { return; }

      return ensureComponentCSSClassIncluded(Component, name);
    },

    componentFor: function(name) {
      var Component = this._super.apply(this, arguments);

      if (!Component) { return; }

      return ensureComponentCSSClassIncluded(Component, name);
    }
  });
})()
