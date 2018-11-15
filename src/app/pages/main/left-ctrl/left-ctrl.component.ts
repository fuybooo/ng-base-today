import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-left-ctrl',
  templateUrl: './left-ctrl.component.html',
  styleUrls: ['./left-ctrl.component.less']
})
export class LeftCtrlComponent implements OnInit {
  @Input() isCollapsed;
  userName;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  changeRouter(url) {
    this.router.navigateByUrl(url);
  }
  openAddListModal() {}
}
