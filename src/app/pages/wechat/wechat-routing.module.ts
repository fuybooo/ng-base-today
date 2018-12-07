import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitGuardService} from '../../core/guard/init-guard.service';
import {WechatComponent} from './wechat.component';
import {LoginComponent} from './login/login.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuardService],
    component: WechatComponent
  },
  {
    path: 'login',
    canActivate: [InitGuardService],
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WechatRoutingModule { }
