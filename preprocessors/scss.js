var sass = require('node-sass');

module.exports = function (fileContents) {
  var options = {
    data: fileContents
  };
  return sass.renderSync(options).css;
}
