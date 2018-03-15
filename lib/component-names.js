'use strict';

var md5 = require('md5');

module.exports = {
  path: function(actualPath) {
    var terminator = '/';

    return actualPath.substr(0, actualPath.lastIndexOf(terminator));
  },

  class: function(modifiedPath, terseClassNames) {
    var seperator = '__';
    var componentPath = this.path(modifiedPath);
    var className = seperator + md5(componentPath).slice(-5);

    if (!terseClassNames) {
      className = seperator + componentPath.replace(/\//g, seperator) + className;
    }

    return className;
  }
};
