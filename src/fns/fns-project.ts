import {NzTreeNode} from 'ng-zorro-antd';
let resNode;
/**
 * 获取默认的模态框底部按钮组
 * @param onClick ok按钮确认事件，必须传入
 * @param onCancel cancel按钮确认事件，必须传入
 * @param boolean needDisabled 是否需要禁用逻辑
 * @param string formKey 禁用逻辑调用的form表单的key值
 * @param (_modal) => any disabled 默认的禁用逻辑，验证表单是否合法，是否干净
 * @param (modal) => any onCancel 默认的取消事件
 * @returns ({label: string} | {label: string; disabled: (_modal) => any; onClick: any} | {label: string; onClick: any})[]}
 */
export function getModalFooter(onClick, onCancel, needDisabled = false, formKey = 'form', disabled = (_modal) => needDisabled && (_modal[formKey].invalid || _modal[formKey].pristine)) {
  return [
    {
      label: '取消',
      onClick: onCancel
    },
    needDisabled ?
      {
        label: '确定',
        type: 'primary',
        disabled,
        onClick
      } : {
        label: '确定',
        type: 'primary',
        onClick
      }
  ];
}

/**
 * 将数组转换为树
 */
function convertListToTree(array) {
  const list = [];
  for (const item of array) {
    if (isRoot(item, array)) {
      const children = getChildren(item, array);
      if (children.length > 0) {
        item.children = children;
        item.isLeaf = false;
      } else {
        item.isLeaf = true;
      }
      list.push(new NzTreeNode(item));
    }
  }
  return list;
}


/**
 * 判断节点是否为根
 */
function isRoot(item, array): boolean {
  const parentString = getParentIdStr(item);
  if (parentString && item[parentString]) {
    for (const a of array) {
      if (a.id === item[parentString]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 获取所有的子元素
 */
export function getChildren(item, array) {
  const children = [];
  for (const data of array) {
    const parentId = getParentIdStr(data);
    if (item.id === data[parentId]) {
      const _children = getChildren(data, array);
      if (_children.length > 0) {
        data.children = _children;
        data.isLeaf = false;
      } else {
        data.isLeaf = true;
      }
      children.push(data);
    }
  }
  return children;
}
/**
 * 根据 value 和 key 获取当前树中的节点
 */
export function getNodeByValue(nodes: NzTreeNode[], value, key = 'id') {
  resNode = null;
  reGetNodeByValue(nodes, value, key);
  return resNode;
}
function reGetNodeByValue(nodes: NzTreeNode[], value, key = 'id') {
  for (let i = 0, l = nodes.length; i < l; i ++) {
    const node = nodes[i];
    if (node.origin[key] === value) {
      resNode = node;
      break;
    } else {
      if (node.children && node.children.length) {
        reGetNodeByValue(node.children, value, key);
      }
    }
  }
}

/**
 * 根据node获取它所有的父节点
 */
export function getAllParent(node: NzTreeNode, parents: NzTreeNode[] = []) {
  const parent = node.getParentNode();
  if (parent) {
    parents.unshift(parent);
    if (parent.getParentNode()) {
      return getAllParent(parent, parents);
    }
  }
  return parents;
}

/**
 * 获取父id的key
 */
function getParentIdStr(data): string {
  const parentIds = ['pid', 'parentid', 'parentId', 'pId', 'parent_id'];
  for (const item of parentIds) {
    if (item in data) {
      return item;
    }
  }
}

/**
 * 根据扁平树list转换为层次树数据
 */
export function getNodesByList(list, titleKey = 'name', key = 'id') {
  return convertListToTree((list || []).map(item => {
    return {
      ...item,
      title: item[titleKey],
      key: item[key],
    };
  }));
}
