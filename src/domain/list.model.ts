import {guid} from '../fns/fns-util';

export class List {
  uid: string;
  title: string;
  createAt: number;
  constructor(title: string) {
    this.uid = guid();
    this.title = title;
  }
}
