export function querySelector(node, query) {
  if (typeof FastBoot === 'undefined') {
    return document.querySelector(query);
  }

  if (node.tagName === query.toUpperCase()) {
    return node;
  }

  if (node.getAttribute && (node.getAttribute('class') || '').includes(query)) {
    return node;
  }

  let childNode = node.firstChild;

  while (childNode) {
    let selectedNode = querySelector(childNode, query);

    if (selectedNode) {
      return selectedNode;
    }

    childNode = childNode.nextSibling;
  }
}
