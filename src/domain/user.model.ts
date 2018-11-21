/**
 * 详细的属性需要根据项目
 */
export interface UserParams {
  key?: string;
}
export interface UserRes {
  code: string | number;
  msg: string;
  data: any | {
    results?: any[]
  };
}
