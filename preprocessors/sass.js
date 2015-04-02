var sass = require('node-sass');

module.exports = function (fileContents) {
  // Strip off any curly braces
  fileContents = fileContents.replace(/\{|\}/g, '');

  // Make sure every line after the first is indented
  // This ensures it's scoped to the component class
  fileContents = fileContents.replace(/[\n\r]/g, '\n\r  ');

  var options = {
    data: fileContents,
    indentedSyntax: true
  };
  return sass.renderSync(options).css;
}
