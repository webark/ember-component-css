const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const FSTree = require('fs-tree-diff');

module.exports = class StyleInfo extends Plugin {
  constructor(tree, options = {}) {
    super([].concat(tree), {
      annotation: options.annotation,
      persistentOutput: true
    });

    this.include = options.include;
    this.exclude = options.exclude;
    this.directories = options.directories || false;
    this.currentTree = new FSTree();
  }

  build() {
    this.inputPath = this.inputPaths[0];
    const entries = walkSync.entries(this.inputPath, {
      globs: this.include,
      ignore: this.exclude,
      directories: this.directories,
    });
    const nextTree = FSTree.fromEntries(entries, { sortAndExpand: true });
    const currentTree = this.currentTree;

    this.currentTree = nextTree;
    const patches = currentTree.calculatePatch(nextTree);

    return Promise.resolve().then(this.walker.bind(this, patches));
  }

  walker(patches) {
    for (const [action, path] of patches) {
      if (typeof this[action] === 'function') {
        this[action](path);
      }
    }
  }
}
