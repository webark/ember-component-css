/* eslint-env node */
'use strict';

var md5 = require('md5');

module.exports = {
  path: function(actualPath, classicStyleDir) {
    var terminator = '/';
    var pathSegementToRemove = '';

    if (actualPath.includes(classicStyleDir)) {
      terminator = '.';
      pathSegementToRemove = 'styles/' + classicStyleDir + '/';
    }

    actualPath = actualPath.substr(0, actualPath.lastIndexOf(terminator)).replace(pathSegementToRemove, '');
    const pathParts = actualPath.split('/');
    if (pathParts.indexOf('components') === 1) {
      const namespace = pathParts[0];
      return actualPath.replace(namespace + '/', '').replace('components/', `component:${namespace}@`);
    }

    if (pathParts.indexOf('routes') === 1) {
      const namespace = pathParts[0];
      return actualPath.replace(namespace + '/', '').replace('routes/', `route:${namespace}@`);
    }
  },

  class: function(modifiedPath, classicStyleDir, terseClassNames) {
    var seperator = '__';
    var componentPath = this.path(modifiedPath, classicStyleDir);
    var className = seperator + md5(componentPath).slice(-5);

    if (!terseClassNames) {
      className = seperator + componentPath.replace(/\/|@|:/g, seperator) + className;
    }

    return className;
  }
};
