module.exports = {
  path: function(actualPath) {
    return actualPath.substr(0, actualPath.lastIndexOf("/")).replace('components/', '');
  },
  class: function(modifiedPath) {
    return this.path(modifiedPath).replace(/\//g, '__');
  }
};
