const data = require('fs').readFileSync('./06-in.txt', 'utf8');

function readData(str) {
  return str.split('\n').map(line => {
    const [parent, child] = line.split(')');
    return {parent, child};
  });
}

function buildTree(relations) {
  let rootNode = {id: 'COM'};
  const nodes = new Map();
  nodes.set('COM', rootNode);

  relations.forEach(({child}) => nodes.set(child, {id: child}));
  relations.forEach(({parent, child}) => {
    const childNode = nodes.get(child);
    const parentNode = nodes.get(parent);

    if (!parentNode) {
      console.error('no parent', parent, child);
      return;
    }
    childNode.parent = parentNode;

    if (!parentNode.children) {
      parentNode.children = [];
    }
    parentNode.children.push(childNode);
  });

  return {nodes, rootNode};
}

function findNode(tree, predicate) {
  return findAllNodes(tree, predicate)[0];
}

function findAllNodes(node, predicate) {
  const res = [];

  if (predicate(node)) {
    res.push(node);
  }

  if (node.children) {
    for (let child of node.children) {
      res.push(...findAllNodes(child, predicate));
    }
  }

  return res;
}

function visit(tree, pre, post) {
  pre && pre(tree);
  if (tree.children) {
    for (let child of tree.children) {
      visit(child, pre, post);
    }
  }
  post && post(tree);
}

function addNodeDepths(rootNode) {
  visit(rootNode, node => {
    node.depth = node.parent ? node.parent.depth + 1 : 0;
  });

  return rootNode;
}

function parents(node) {
  if (!node.parent) {
    return [];
  }

  return [node.parent, ...parents(node.parent)];
}

const {nodes, rootNode} = buildTree(
  // readData(`COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L`)
  // readData(
  //   'COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN'
  // )
  readData(data)
);
addNodeDepths(rootNode);

let sum = 0;
for (let node of nodes.values()) {
  console.log(node.id, node.depth);
  sum += node.depth;
}
console.log('sum: ', sum);
// console.dir(nodes, {depth: 20});

// find common parent
const me = findNode(rootNode, node => node.id === 'YOU');
const santa = findNode(rootNode, node => node.id === 'SAN');
const myParents = new Set(parents(me).map(node => node.id));
const firstCommonAncestor = parents(santa).find(node => myParents.has(node.id));

console.log('distance', me.depth + santa.depth - 2 * firstCommonAncestor.depth - 2);

console.log({firstCommonAncestor});

// console.log({
//   me,
//   santa,
//   myparents: parents(me),
//   santaParents: parents(santa)
// });
