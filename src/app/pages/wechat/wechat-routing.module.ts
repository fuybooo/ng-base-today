import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitGuardService} from '../../core/guard/init-guard.service';
import {WechatComponent} from './wechat.component';
import {LoginComponent} from './login/login.component';
import {PcComponent} from './pc/pc.component';
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
  },
  {
    path: 'pc',
    canActivate: [InitGuardService],
    component: PcComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WechatRoutingModule { }
