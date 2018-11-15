import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SetupComponent} from './setup.component';
import {InitGuardService} from '../../core/services/init-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuardService],
    component: SetupComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule { }
