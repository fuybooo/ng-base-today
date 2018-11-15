import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  @Input() isCollapsed;
  crtListUid;
  lists = [];
  constructor() { }

  ngOnInit() {
  }
  clickItem(title) {}
}
