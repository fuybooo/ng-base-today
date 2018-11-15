import {Component, HostBinding, OnInit} from '@angular/core';
import {mainTransition} from './main.animation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  animations: [mainTransition]
})
export class MainComponent implements OnInit {
  @HostBinding('@mainTransition') state = 'activated';
  isCollapsed = false;
  constructor() { }

  ngOnInit() {
  }

}
