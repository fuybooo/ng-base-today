import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-ctrl',
  templateUrl: './right-ctrl.component.html',
  styleUrls: ['./right-ctrl.component.less']
})
export class RightCtrlComponent implements OnInit {
  visible = false;
  constructor() { }

  ngOnInit() {
  }
  open() {
    this.visible = true;
  }
  close() {
    this.visible = false;
  }
}
