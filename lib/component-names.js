module.exports = {
  path: function(actualPath) {
    return actualPath.substr(0, actualPath.lastIndexOf("/")).replace('components/', '');
  },
  class: function(modifiedPath) {
    return '_' + this.path(modifiedPath).replace(/\//g, '__');
  }
};
