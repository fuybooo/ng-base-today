import {Component, OnInit, ViewChild} from '@angular/core';
import {TodoComponent} from './todo/todo.component';

@Component({
  selector: 'app-right-ctrl',
  templateUrl: './right-ctrl.component.html',
  styleUrls: ['./right-ctrl.component.less']
})
export class RightCtrlComponent implements OnInit {
  @ViewChild(TodoComponent) public todoList: TodoComponent;
  listUid: string;
  constructor(
  ) { }

  ngOnInit() {
  }
  add(title: string) {
    this.todoList.add(title);
  }
}
