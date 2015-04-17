var SelectorParser = require('css-selector-parser').CssSelectorParser;

var parser = new SelectorParser()
    .registerAttrEqualityMods('|', '*', '~', '^', '$')
    .registerNestingOperators('>', '~', '+')
    .registerSelectorPseudos('matches', 'has', 'not', '--global');

/*
 * For the given selector string, rewrites all class names to be prefixed by
 * the given base name, as well as replacing instances of :--component with
 * that base class.
 *
 * Since classnames are the only thing we have direct control over, by default
 * only they and the :--component pseudoselector are considered valid.
 * Users may opt out of namespacing for part of a selector by wrapping it in
 * :--global() pseudoselector. Within that, anything is fair game and we won't
 * mess with it.
 */
module.exports = function namespaceSelector(selector, base) {
  var parsed = parser.parse(selector);
  namespaceClasses(parsed, base);
  return parser.render(parsed);
};

function namespaceClasses(selector, base) {
  if (selector.type === 'selectors') {
    selector.selectors.forEach(function(selector) { namespaceClasses(selector, base); });
  } else if (selector.type === 'ruleSet') {
    namespaceClasses(selector.rule, base);
  } else if (selector.type === 'rule') {
    namespaceRule(selector, base);
  } else {
    throw new Error('Unknown selector node type: ' + selector.type);
  }
}

// 'Rule' is the selector parser's terminology for whitespace-or-operator separated
// selector segments, which it arranges into a linked-list-esque structure. For instance,
// `foo .bar > [baz]` consists of three rules.
function namespaceRule(rule, base) {
  if (!isValid(rule)) {
    throw new Error('Only class-based selectors can be scoped to a component. ' +
      'If you want to opt out of scoping for a selector segment, you can wrap it in :--global()');
  }

  if (rule.rule) {
    namespaceRule(rule.rule, base);
  }

  if (hasClasses(rule)) {
    rule.classNames = rule.classNames.map(function(className) {
      return base + '-' + className;
    });
  }

  if (hasPseudos(rule)) {
    // If the rule is valid, we know it has at most one pseudoselector,
    // which is either :--component or :--global()
    if (rule.pseudos[0].name === '--component') {
      rule.pseudos = [];
      rule.classNames = rule.classNames || [];
      rule.classNames.push(base);
    } else {
      unwrapGlobal(rule);
    }
  }
}

// Unwrap the contents of a :--global() pseudoselector rule
function unwrapGlobal(wrapper) {
  var globalRule = wrapper.pseudos[0].value.rule;

  // Move the attributes of the global rule to this node
  wrapper.tagName = globalRule.tagName;
  wrapper.classNames = (wrapper.classNames || []).concat(globalRule.classNames || []);
  wrapper.attrs = globalRule.attrs;
  wrapper.pseudos = globalRule.pseudos;

  // Rework the bottom of the sibling/descendant chain to point to the
  // next rule down from the :--global() wrapper.
  var deepestRule = globalRule;
  while (deepestRule.rule) { deepestRule = deepestRule.rule; }
  deepestRule.rule = wrapper.rule;
  wrapper.rule = globalRule.rule;
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
