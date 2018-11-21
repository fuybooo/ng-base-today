import { Injectable } from '@angular/core';
import {Todo} from '../../domain/todo.model';
import {Subject} from 'rxjs';
import {ListService} from './list.service';
import {RankBy} from '../core/common/common.model';
import {LocalStorageService} from '../core/local-storage/local-storage.service';
import {TODOS} from '../core/local-storage/local-storage.namespace';
import {floorToMinute, getCurrentTime, ONE_HOUR} from '../../fns/fns-time';

@Injectable()
export class TodoService {
  todo$ = new Subject<Todo[]>();
  rank$ = new Subject<RankBy>();
  completedHide$ = new Subject<boolean>();
  crtUid$ = new Subject<string>();

  private todos: Todo[] = [];
  private rank: RankBy = 'title';
  private completedHide = false;
  private crtUid: string;
  constructor(
    private listService: ListService,
    private store: LocalStorageService
  ) {
    this.todos = this.store.getList(TODOS);
  }
  private broadCast(): void {
    this.todo$.next(this.todos);
    this.rank$.next(this.rank);
    this.completedHide$.next(this.completedHide);
    this.crtUid$.next(this.crtUid);
  }
  private persist(): void {
    this.store.set(TODOS, this.todos);
  }
  update(todo: Todo): void {
    const index = this.todos.findIndex(t => t.uid === todo.uid);
    if (index !== -1) {
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.todos.splice(index, 1, todo);
      this.persist();
      this.broadCast();
    }
  }
  getAll(): void {
    this.todos = this.store.getList(TODOS);
    this.broadCast();
  }
  getRaw(): Todo[] {
    return this.todos;
  }
  setCrtUid(uid: string): void {
    this.crtUid = uid;
    this.broadCast();
  }
  getByUid(uid: string): Todo | null {
    return this.todos.find((todo: Todo) => todo.uid === uid);
  }
  setTodoToday(uid: string): void {
    const todo = this.getByUid(uid);
    if (todo && !todo.completedFlag) {
      todo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      this.update(todo);
    }
  }
  toggleTodoComplete(uid: string): void {
    const todo = this.getByUid(uid);
    if (todo) {
      todo.completedFlag = !todo.completedFlag;
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.persist();
      this.completedHide$.next(this.completedHide);
    }
  }
  moveToList(uid: string, listUid: string): void {
    const todo = this.getByUid(uid);
    if (todo) {
      todo.listUid = listUid;
      this.update(todo);
    }
  }
  add(title: string): void {
    const listUid = this.listService.getCurrentListUid();
    const newTodo = new Todo(title, listUid);
    if (listUid === 'today') {
      newTodo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      newTodo.listUid = 'todo';
    }
    this.todos.push(newTodo);
    this.persist();
    this.broadCast();
  }
  delete(uid: string): void {
    const originLength = this.todos.length;
    this.todos = [...this.todos.filter(t => t.uid !== uid)];
    if (originLength !== this.todos.length) {
      this.persist();
      this.broadCast();
    }
  }

  /**
   * 根据listUid删除
   */
  deleteInList(listUid: string): void {
    const toDelete = this.todos.filter(t => t.listUid === listUid);
    toDelete.forEach(t => this.delete(t.uid));
  }
  toggleRank(r: RankBy): void {
    this.rank = r;
    this.rank$.next(r);
  }
  toggleCompletedHide(hide: boolean): void {
    this.completedHide = hide;
    this.completedHide$.next(hide);
  }
}

