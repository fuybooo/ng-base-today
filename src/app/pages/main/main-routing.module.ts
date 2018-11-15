import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {DetailComponent} from './detail/detail.component';
import {InitGuardService} from '../../core/services/init-guard.service';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [InitGuardService],
  },
  {
    path: ':id',
    component: DetailComponent,
    canActivate: [InitGuardService],
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
