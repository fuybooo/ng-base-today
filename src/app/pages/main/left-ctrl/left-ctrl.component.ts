import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ListComponent} from './list/list.component';
import {LocalStorageService} from '../../../core/local-storage/local-storage.service';
import {USERNAME} from '../../../core/local-storage/local-storage.namespace';

@Component({
  selector: 'app-left-ctrl',
  templateUrl: './left-ctrl.component.html',
  styleUrls: ['./left-ctrl.component.less']
})
export class LeftCtrlComponent implements OnInit {
  @Input() isCollapsed;
  @ViewChild(ListComponent) listComponent: ListComponent;
  userName;
  constructor(
    private router: Router,
    private store: LocalStorageService
    ) { }

  ngOnInit() {
    this.userName = this.store.get(USERNAME);
  }
  changeRouter(url) {
    this.router.navigateByUrl(url);
  }
  openAddListModal(): void {
    this.listComponent.openAddListModal();
  }
}
