import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {NzDropdownContextComponent, NzDropdownService} from 'ng-zorro-antd';
import {combineLatest, Subject} from 'rxjs';
import {Todo} from '../../../../../domain/todo.model';
import {List} from '../../../../../domain/list.model';
import {ListService} from '../../../../services/list.service';
import {TodoService} from '../../../../services/todo.service';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/internal/operators';
import {RankBy} from '../../../../core/common/common.model';
import {floorToDate, getTodayTime} from '../../../../../fns/fns-time';
const rankerGenerator = (type: RankBy = 'title'): any => {
  if (type === 'completeFlag') {
    return (t1: Todo, t2: Todo) => t1.completedFlag && !t2.completedFlag;
  }
  return (t1: Todo, t2: Todo) => t1[type] > t2[type];
};

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less']
})
export class TodoComponent implements OnInit, OnDestroy {
  private dropdown: NzDropdownContextComponent;
  private destroy$ = new Subject();
  todos: Todo[] = [];
  lists: List[] = [];
  currentContextTodo: Todo;
  crtListUid: string;
  visible = false;
  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropdownService: NzDropdownService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listService.lists$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lists => this.lists = lists);
    combineLatest(
      this.listService.currentUid$,
      this.todoService.todo$,
      this.todoService.rank$,
      this.todoService.completedHide$
    ).pipe(takeUntil(this.destroy$))
      .subscribe(sources => this.processTodos(sources[0], sources[1], sources[2], sources[3]));
    this.todoService.getAll();
    this.listService.getAll();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  processTodos(listUid: string, todos: Todo[], rank: RankBy, completedHide: boolean): void {
    this.crtListUid = listUid;
    const filteredTodos = todos.filter(todo => {
      return listUid === todo.listUid ||
             (listUid === 'today' && todo.planAt && floorToDate(todo.planAt) >= getTodayTime() ||
             (listUid === 'todo' && (!todo.listUid || todo.listUid === 'todo'))
        );
    })
      .map(todo => Object.assign({}, todo) as Todo)
      .sort(rankerGenerator(rank))
      .filter(todo => completedHide ? !todo.completedFlag : todo);
    this.todos = [...filteredTodos];
  }
  add(title: string): void {
    this.todoService.add(title);
  }
  click(uid: string): void {
    this.todoService.setCrtUid(uid);
    this.visible = true;
  }
  contextMenu(
    $event: MouseEvent,
    template: TemplateRef<void>,
    uid: string
  ): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContextTodo = this.todos.find(t => t.uid === uid);
  }
  listsExcept(listUid: string): List[] {
    return this.lists.filter(l => l.uid !== listUid);
  }
  toggle(uid: string): void {
    this.todoService.toggleTodoComplete(uid);
  }
  delete(): void {
    this.todoService.delete(this.currentContextTodo.uid);
  }
  setToday(): void {
    this.todoService.setTodoToday(this.currentContextTodo.uid);
  }
  moveToList(listUid: string): void {
    this.todoService.moveToList(this.currentContextTodo.uid, listUid);
  }
  close(): void {
    this.dropdown.close();
  }
  closeDrawer() {
    this.visible = false;
  }
}
