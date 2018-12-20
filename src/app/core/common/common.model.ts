export type RankBy = 'title' | 'dueAt' | 'planAt' | 'completeFlag';
export interface HttpRes {
  code: number | string;
  msg: string;
  data: any | {
    results?: Array<any> | {
      list?: Array<any>,
      total?: number
    },
    pageNumber?: number,
    pageSize?: number,
    total?: number
  };
}
export const AJAXTYPE = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};
/**
 * 全局的正则表达式
 */
export const REGEXP = {
  number: /\d/,
  charORNumber: /^[a-zA-Z0-9]+$/,
  cnMobile: /^1(3|4|5|7|8|9)\d{9}$/,
  ch: /[\u4e00-\u9fa5]/,
  onlyCh: /^[\u4e00-\u9fa5]+$/,
  num1_99: /^([1-9]|[1-9]\d)$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  special: /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]·！￥（—）：；“”‘、，|《。》？【】]/im,
};
