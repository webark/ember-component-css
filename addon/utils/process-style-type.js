const STYLE_EXETNSTIONS = [
  'css',
  'less',
  'scss',
  'sass',
  'styl',
];

// eslint-disable-next-line no-useless-escape
const EXTENTION_REGEX = `\.(${STYLE_EXETNSTIONS.join('|')})$`;

function formatFullName(stylePath) {
  return stylePath.replace(new RegExp(`(/(styles?|index))?${EXTENTION_REGEX}`), '').replace(/.*?\//, '').replace(/^components\//, '');
}

export default function addComponentStyleNamespace(owner) {
  const styleFileExtentionRegEx = new RegExp(EXTENTION_REGEX);

  return STYLE_EXETNSTIONS.reduce(function(allStyles, extention) {
    return allStyles.concat(owner.lookup('container-debug-adapter:main').catalogEntriesByType(extention));
  }, [])
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter(stylePath => styleFileExtentionRegEx.test(stylePath))
    .map(stylePath => {
      const fullName = formatFullName(stylePath);
      // eslint-disable-next-line no-undef
      const factory = require(stylePath).default;

      owner.register(`style:${fullName}`, factory, { instantiate: false, singleton: true });

      return fullName;
    });
}