var postcss = require('postcss');
var postcssSelectorNamespace = require('postcss-selector-namespace')
var os = require('os');

module.exports = {
  indentation: function(contents, className) {
    contents = contents.replace(/:--component/g, '&');
    contents = '.' + className + os.EOL + contents;

    // Indent styles for scoping and make sure it ends with a
    // newline that is not indented
    return contents.replace(new RegExp(os.EOL, 'g'), os.EOL + '  ') + os.EOL;
  },

  wrap: function(contents, className) {
    // Replace instances of :--component with '&'
    contents = contents.replace(/:--component/g, '&');

    // Wrap the styles inside the generated class
    return '.' + className + '{' + contents + '}';
  },

  default: function(contents, className) {
    return postcss().use(postcssSelectorNamespace({
              selfSelector: /&|:--component/,
              namespace: '.' + className,
              ignoreRoot: false
            })).process(contents).css;
  }
};
