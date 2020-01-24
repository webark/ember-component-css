/* eslint-env node */
'use strict';

var md5 = require('md5');
var path = require('path');

module.exports = {
  path: function(actualPath, classicStyleDir) {
    var terminator = '/';
    var pathSegementToRemove = /^components\//;

    if (actualPath.includes(classicStyleDir)) {
      terminator = '.';
      pathSegementToRemove = 'styles/' + classicStyleDir + '/';
    } else { // Colocated component stylesheet
      var pathInfo = path.parse(actualPath);
      if (pathInfo.name !== 'styles') {
        terminator = '.';
      }  
    } 

    return actualPath.substr(0, actualPath.lastIndexOf(terminator)).replace(pathSegementToRemove, '');
  },

  class: function(modifiedPath, classicStyleDir, terseClassNames) {
    var seperator = '__';
    var componentPath = this.path(modifiedPath, classicStyleDir);
    var className = seperator + md5(componentPath).slice(-5);

    if (!terseClassNames) {
      className = seperator + componentPath.replace(/\//g, seperator) + className;
    }

    return className;
  }
};
