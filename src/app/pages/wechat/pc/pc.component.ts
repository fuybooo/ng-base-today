import { Component, OnInit } from '@angular/core';
import {CoreService} from '../../../core/core.service';

@Component({
  selector: 'app-pc',
  templateUrl: './pc.component.html',
  styleUrls: ['./pc.component.less']
})
export class PcComponent implements OnInit {
  lang;
  numList = Array(12);
  circleList = Array(3);
  constructor(
    private core: CoreService
  ) { }

  ngOnInit() {
    this.lang = this.core.getDefaultLang();
  }

}
