import { NgModule } from '@angular/core';
import { SetupComponent } from './setup.component';
import {SetupRoutingModule} from './setup-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [SetupComponent],
  imports: [
    SharedModule,
    SetupRoutingModule
  ]
})
export class SetupModule { }
