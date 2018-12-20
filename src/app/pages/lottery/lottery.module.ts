import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {LotteryComponent} from './lottery.component';
import {LotteryRoutingModule} from './lottery-routing.module';
import { CanvasComponent } from './canvas/canvas.component';
import { SettingComponent } from './setting/setting.component';
import { PrizeFormComponent } from './setting/prize-form/prize-form.component';

@NgModule({
  declarations: [LotteryComponent, CanvasComponent, SettingComponent, PrizeFormComponent],
  entryComponents: [PrizeFormComponent],
  imports: [
    SharedModule,
    LotteryRoutingModule
  ]
})
export class LotteryModule { }
