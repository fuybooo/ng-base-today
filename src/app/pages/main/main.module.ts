import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import {SharedModule} from '../../shared/shared.module';
import {MainRoutingModule} from './main-routing.module';
import { LeftCtrlComponent } from './left-ctrl/left-ctrl.component';
import { RightCtrlComponent } from './right-ctrl/right-ctrl.component';
import { ListComponent } from './left-ctrl/list/list.component';
import { DetailComponent } from './detail/detail.component';
import { HeaderComponent } from './right-ctrl/header/header.component';
import { TodoComponent } from './right-ctrl/todo/todo.component';
import { QuickAddComponent } from './right-ctrl/quick-add/quick-add.component';
import { SuggestComponent } from './right-ctrl/header/suggest/suggest.component';

@NgModule({
  declarations: [MainComponent, LeftCtrlComponent, RightCtrlComponent, ListComponent, DetailComponent, HeaderComponent, TodoComponent, QuickAddComponent, SuggestComponent],
  imports: [
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
