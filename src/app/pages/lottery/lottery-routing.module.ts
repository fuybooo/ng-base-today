import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitGuardService} from '../../core/guard/init-guard.service';
import {LotteryComponent} from './lottery.component';
import {SettingComponent} from './setting/setting.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuardService],
    component: LotteryComponent,
    data: {
      title: '抽奖系统'
    }
  },
  {
    path: 'setting',
    canActivate: [InitGuardService],
    component: SettingComponent,
    data: {
      title: '抽奖系统-设置'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LotteryRoutingModule { }
