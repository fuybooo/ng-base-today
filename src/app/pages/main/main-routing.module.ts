import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {InitGuardService} from '../../core/guard/init-guard.service';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [InitGuardService],
  },
  {
    path: ':listUid',
    component: MainComponent,
    canActivate: [InitGuardService],
  },
  {
    path: ':listUid/:id',
    component: MainComponent,
    canActivate: [InitGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
