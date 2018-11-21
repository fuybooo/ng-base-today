import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoService} from '../../../services/todo.service';
import {Todo} from '../../../../domain/todo.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {floorToDate, floorToMinute, getCurrentTime, getTodayTime, lessThanADay} from '../../../../fns/fns-time';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  @Output() changedTodo = new EventEmitter();

  private trueSource: Todo;
  currentTodo: Todo = new Todo('');
  dueDate: Date;
  planDate: Date;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private message: NzMessageService
    ) { }

  ngOnInit() {
    this.todoService.crtUid$.subscribe(crtUid => {
      const todo = this.todoService.getByUid(crtUid);
      this.trueSource = todo;
      this.currentTodo = Object.assign({}, todo) as Todo;
      if (todo && todo.dueAt) {
        this.dueDate = new Date(todo.dueAt);
      }
      if (todo && todo.planAt) {
        this.planDate = new Date(todo.planAt);
      }
    });
  }
  handlePlanDateChange(date: Date): void {
    const t = date ? date.getTime() : undefined;
    if (!t) {
      this.currentTodo.notifyMe = false;
    }
    this.currentTodo.planAt = t;
    this.checkDate();
  }
  handleDueDateChange(date: Date): void {
    const dueAt = date ? date.getTime() : undefined;
    this.currentTodo.dueAt = dueAt;
    if (dueAt && lessThanADay(dueAt)) {
      this.message.warning('项目将会在 24 小时内到期', {
        nzDuration: 6000
      });
    }
    this.checkDate();
  }
  private checkDate(): void {
    const {dueAt, planAt} = this.currentTodo;
    if (dueAt && planAt && floorToDate(planAt) > dueAt) {
      this.message.warning('您确定要在到期之后才开始做这个项目吗', {
        nzDuration: 6000
      });
    }
  }
  dueDisabledDate = (d: Date): boolean => floorToDate(d) < getTodayTime();
  planDisabledDate = (d: Date): boolean => floorToMinute(d) < getCurrentTime();
  clickSwitch(): void {
    if (this.currentTodo.completedFlag) {
      return;
    }
    if (!this.currentTodo.planAt) {
      this.message.warning('尚未设置计划日期');
      return ;
    }
    this.currentTodo.notifyMe = !this.currentTodo.notifyMe;
  }
  close() {
  }
  confirm(): void {
    this.todoService.update(this.currentTodo);
    this.close();
  }
  delete(): void {
    this.todoService.delete(this.currentTodo.uid);
    this.close();
  }
}
