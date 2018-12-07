import {Component, OnInit} from '@angular/core';
import {CoreService} from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(
    private core: CoreService
  ) {}
  ngOnInit() {
    this.core.initTranslateConfig();
  }
}
