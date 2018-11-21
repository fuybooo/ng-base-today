import {guid} from '../fns/fns-util';

export class Todo {
  uid: string;
  title: string;
  createdAt: number;
  listUid: string;
  desc: string;
  completedFlag: boolean;
  completedAt: number;
  dueAt: number;
  planAt: number;
  notifyMe = false;

  constructor(title: string, listUid?: string) {
    this.uid = guid();
    this.title = title;
    this.listUid = listUid;
    this.completedFlag = false;
  }
}
