import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitGuardService} from '../../core/guard/init-guard.service';
import {SettingComponent} from './setting.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuardService],
    component: SettingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule { }
