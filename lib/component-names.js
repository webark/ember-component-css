/* eslint-env node */
'use strict';

var md5 = require('md5');

module.exports = {
  path: function(actualPath, classicStyleDir, config) {
    var terminator = '/';
    var pathSegementToRemove = '';

    if (actualPath.includes(classicStyleDir)) {
      terminator = '.';
      pathSegementToRemove = 'styles/' + classicStyleDir + '/';
    }

    actualPath = actualPath.substr(0, actualPath.lastIndexOf(terminator)).replace(pathSegementToRemove, '');
    const pathParts = actualPath.split('/');
    const components = ['components'].concat(config.componentRootPaths);
    if (components.includes(pathParts[1])) {
      const namespace = pathParts[0];
      const componentNamespace = config.namespaceStyles ? namespace : config.modulePrefix;
      return actualPath.replace(namespace + '/', '').replace(pathParts[1]+'/', `component:${componentNamespace}@`);
    }

    const routes = ['routes'].concat(config.routeRootPaths);
    if (routes.includes(pathParts[1])) {
      const namespace = pathParts[0];
      const routeNamespace = config.namespaceStyles ? namespace : config.modulePrefix;
      return actualPath.replace(namespace + '/', '').replace(pathParts[1]+'/', `route:${routeNamespace}@`);
    }

    throw new Error('Could not associate ' + actualPath + ' with routes or components');
  },

  class: function(modifiedPath, classicStyleDir, terseClassNames, config) {
    var seperator = '__';
    var componentPath = this.path(modifiedPath, classicStyleDir, config);
    var className = seperator + md5(componentPath).slice(-5);

    if (!terseClassNames) {
      className = seperator + componentPath.replace(/\/|@|:/g, seperator) + className;
    }

    return className;
  }
};
