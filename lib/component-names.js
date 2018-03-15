const md5 = require('md5');

module.exports = {
  path(actualPath) {
    const terminator = '/';

    return actualPath.substr(0, actualPath.lastIndexOf(terminator));
  },

  class(modifiedPath, terseClassNames) {
    const seperator = '__';
    const componentPath = this.path(modifiedPath);
    let className = seperator + md5(componentPath).slice(-5);

    if (!terseClassNames) {
      className = seperator + componentPath.replace(/\//g, seperator) + className;
    }

    return className;
  }
};
