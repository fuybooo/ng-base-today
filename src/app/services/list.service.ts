import { Injectable } from '@angular/core';
import {List} from '../../domain/list.model';
import {Subject} from 'rxjs';
import {LocalStorageService} from '../core/local-storage/local-storage.service';
import {LISTS} from '../core/local-storage/local-storage.namespace';

declare type SpecialUid = 'today' | 'todo';

@Injectable()
export class ListService {
  private current: List;
  private lists: List[] = [];

  currentUid: SpecialUid | string = 'today';
  currentUid$ = new Subject<string>();
  current$ = new Subject<List>();
  lists$ = new Subject<List[]>();

  constructor(
    private store: LocalStorageService,
  ) { }

  private broadCast(): void {
    this.lists$.next(this.lists);
    this.current$.next(this.current);
    this.currentUid$.next(this.currentUid);
  }
  private persist(): void {
    this.store.set(LISTS, this.lists);
  }
  private getByUid(uid): List {
    return this.lists.find(l => l.uid === uid);
  }
  private update(list: List): void {
    const index = this.lists.findIndex(l => l.uid === list.uid);
    if (index !== -1) {
      this.lists.splice(index, 1, list);
      this.persist();
      this.broadCast();
    }
  }
  getCurrentListUid(): SpecialUid | string {
    return this.currentUid;
  }
  getAll(): void {
    this.lists = this.store.getList(LISTS);
    this.broadCast();
  }
  setCurrentUid(uid: string): void {
    this.currentUid = uid;
    this.current = this.lists.find(l => l.uid === uid);
    this.broadCast();
  }
  add(title: string): void {
    const newList = new List(title);
    this.lists.push(newList);
    this.currentUid = newList.uid;
    this.current = newList;
    this.broadCast();
    this.persist();
  }
  rename(listUid: string, title: string) {
    const list = this.getByUid(listUid);
    if (list) {
      list.title = title;
      this.update(list);
    }
  }
  delete(uid: string): void {
    const index = this.lists.findIndex(l => l.uid === uid);
    if (index !== -1) {
      this.lists.splice(index, 1);
      this.currentUid = this.lists.length ? this.lists[this.lists.length - 1].uid :
        (this.currentUid === 'today' ? 'today' : 'todo');
    }
  }
}
