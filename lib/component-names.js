/* eslint-env node */
'use strict';

var md5 = require('md5');

module.exports = {
  path: function(actualPath, classicStyleDir) {
    var terminator = '/';
    var pathSegementToRemove = 'components/';

    if (actualPath.includes(classicStyleDir)) {
      terminator = '.';
      pathSegementToRemove = 'styles/' + classicStyleDir + '/';
    }

    return actualPath.substr(0, actualPath.lastIndexOf(terminator)).replace(pathSegementToRemove, '');
  },
  class: function(modifiedPath, classicStyleDir) {
    var seperator = '__',
        className = seperator + this.path(modifiedPath, classicStyleDir).replace(/\//g, seperator);
    return className + seperator + md5(className).slice(-5);
  }
};
