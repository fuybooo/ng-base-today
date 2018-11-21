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
