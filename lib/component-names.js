module.exports = {
  path(actualPath) {
    return actualPath.substr(0, actualPath.lastIndexOf("/")).replace('components/', '');
  },
  class(modifiedPath) {
    return this.path(modifiedPath).replace(/\//g, '__');
  }
};
