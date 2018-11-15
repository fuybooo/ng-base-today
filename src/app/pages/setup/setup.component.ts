import {Component, HostBinding, OnInit} from '@angular/core';
import {setupTransition} from './setup.animation';
import {LocalStorageService} from '../../core/services/local-storage.service';
import {INIT_FLAG, START_USING_DATE, USERNAME} from '../../core/services/local-storage.namespace';
import {Router} from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.less'],
  animations: [setupTransition]
})
export class SetupComponent implements OnInit {
  @HostBinding('@setupTransition') state = 'activated';
  username;
  constructor(
    private store: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  completeSetup() {
    if (this.username && this.username.trim()) {
      this.store.set(INIT_FLAG, true);
      this.store.set(START_USING_DATE, Date.now());
      this.store.set(USERNAME, this.username);
      this.router.navigateByUrl('main');
    }
  }
}
