/* eslint-env node */
'use strict';

var md5 = require('md5');

module.exports = {
  path: function(actualPath, classicStyleDir, classicRouteStyleDir) {
    var terminator = '/';
    var pathSegementToRemove = /^components\//;

    if (actualPath.includes(classicStyleDir)) {
      terminator = '.';
      pathSegementToRemove = 'styles/' + classicStyleDir + '/';
    } else if (actualPath.includes(classicRouteStyleDir)) {
      terminator = '.';
      pathSegementToRemove = 'styles/' + classicRouteStyleDir + '/';
    }

    return actualPath.substr(0, actualPath.lastIndexOf(terminator)).replace(pathSegementToRemove, '');
  },

  class: function(modifiedPath, classicStyleDir, classicRouteStyleDir, terseClassNames) {
    var seperator = '__';
    var componentPath = this.path(modifiedPath, classicStyleDir, classicRouteStyleDir);
    var className = seperator + md5(componentPath).slice(-5);

    if (!terseClassNames) {
      className = seperator + componentPath.replace(/\//g, seperator) + className;
    }

    return className;
  }
};
