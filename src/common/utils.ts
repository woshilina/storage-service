/**
 * 扁平数组转 树结构
 **/

export function flatArrayToTree(flatArray) {
  // 创建一个映射，方便通过id查找节点
  const map = new Map();
  flatArray.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // 定义一个递归函数，用于构建每个节点的子树
  function buildTree(node) {
    flatArray.forEach((item) => {
      if (item.parentId === node.id) {
        const childNode = map.get(item.id);
        // 递归构建子树，并添加到当前节点的children中
        node.children.push(buildTree(childNode));
      }
    });
    return node;
  }

  // 过滤出根节点并递归构建整棵树
  return flatArray
    .filter((item) => item.parentId === null)
    .map((rootNode) => buildTree(map.get(rootNode.id)));
}
