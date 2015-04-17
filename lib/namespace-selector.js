var SelectorParser = require('css-selector-parser').CssSelectorParser;

var parser = new SelectorParser()
    .registerAttrEqualityMods('|', '*', '~', '^', '$')
    .registerNestingOperators('>', '~', '+')
    .registerSelectorPseudos('any', 'not', '--global');

module.exports = function namespaceSelector(selector, prefix) {
  var parsed = parser.parse(selector);
  console.log('before', JSON.stringify(parsed, null, 2));
  namespaceClasses(parsed, prefix);
  console.log('after', JSON.stringify(parsed, null, 2));
  return parser.render(parsed);
};

function namespaceClasses(selector, prefix) {
  if (selector.type === 'selectors') {
    selector.selectors.forEach(function(selector) { namespaceClasses(selector, prefix); });
  } else if (selector.type === 'ruleSet') {
    namespaceClasses(selector.rule, prefix);
  } else if (selector.type === 'rule') {
    namespaceRule(selector, prefix);
  } else {
    throw new Error('Unknown selector node type: ' + selector.type);
  }
}

// TODO What exactly do we want to encourage/allow/discourage/disallow? For now, we limit rules
// to containing only classes, :--component, and the :--global() pseudo.
function namespaceRule(rule, prefix) {
  if (!isValid(rule)) {
    throw new Error('Only class-based selectors can be scoped to a component. ' +
      'If you want to opt out of scoping for a selector segment, you can wrap it in :--global()');
  }

  if (hasClasses(rule)) {
    rule.classNames = rule.classNames.map(function(className) {
      return prefix + '-' + className;
    });
  }

  if (hasPseudos(rule)) {
    // If the rule is valid, we know it has at most one pseudoselector,
    // which is either :--component or :--global()
    if (rule.pseudos[0].name === '--component') {
      rule.pseudos = [];
      rule.classNames = rule.classNames || [];
      rule.classNames.push(prefix);
    } else if (rule.pseudos[0].name === '--global') {
      var globalRule = rule.pseudos[0].value.rule;
      if (globalRule.rule) {
        throw new Error(':--global() can\'t contain sibling or descendant operators.');
      }

      rule.tagName = globalRule.tagName;
      rule.classNames = (rule.classNames || []).concat(globalRule.classNames || []);
      rule.attrs = globalRule.attrs;
      rule.pseudos = globalRule.pseudos;
    }
  }

  if (rule.rule) {
    namespaceRule(rule.rule, prefix);
  }
}

function isValid(rule) {
  return !hasTagName(rule)
      && !hasAttrs(rule)
      && (hasClasses(rule) || isValidPseudo(rule));
}

function hasTagName(rule) {
  return !!rule.tagName;
}

function hasClasses(rule) {
  return !!(rule.classNames && rule.classNames.length);
}

function hasAttrs(rule) {
  return !!(rule.attrs && rule.attrs.length);
}

function hasPseudos(rule) {
  return !!(rule.pseudos && rule.pseudos.length); 
}

function isValidPseudo(rule) {
  if (!hasPseudos(rule)) { return false; }

  var pseudoName = rule.pseudos[0].name;
  return rule.pseudos.length === 1 && (pseudoName === '--component' || pseudoName === '--global');
}
