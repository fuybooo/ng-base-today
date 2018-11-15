import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  completeHide = false;
  listTitle = '这是测试标题';
  sortList = [
    {
      code: 'title',
      name: '名称'
    },
    {
      code: 'planAt',
      name: '计划时间'
    },
    {
      code: 'dueAt',
      name: '截止时间'
    },
    {
      code: 'completeFlag',
      name: '完成状态'
    },
  ];
  constructor() { }

  ngOnInit() {
  }
  toggleCompleteHide() {

  }
  switchRankType(code) {

  }
}
