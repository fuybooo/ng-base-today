import {getSafeStr} from '../../../../fns/fns-util';

interface Option {
  text: string;
  value: any;
}
export interface Column {
  key?: string;
  title?: string;
  field?: string; // 使用field就不要再使用formatter属性
  width?: string | number;
  ellipsis?: boolean;
  sortable?: boolean;
  sortField?: string;
  filterable?: boolean;
  filterArray?: Option[];
  filterNotMultiple?: boolean;
  formatter?: string | Function;
  /**
   * 需要显示的事件对应的文本，与event的长度，顺序一一对应
   */
  text?: string | string[] | Array<{value: string, visible?: boolean | string, visibleValueList?: any[], type?: string} | string>;
  /**
   * 事件
   * 注意，edit，view，delete 这三个事件有特殊含义
   * edit, view 会跳转到相应的页面
   * delete会先弹出一个确认窗口
   * 前缀为pop-的事件也有特殊，表示该事件是弹出一个框进行操作
   * 例如pop-edit 是弹出一个框进行编辑
   */
  event?: string | string[];
  textLimit?: number; // 文字长度限制
  link?: string | string[]; // 文本链接
}
/**
 * 获取link url
 */
export function getHref(col, data, event) {
  return getSafeStr(col.link) + '/' + event + '/' + data.id;
}
