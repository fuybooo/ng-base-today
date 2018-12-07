import { NgModule } from '@angular/core';
import { WechatComponent } from './wechat.component';
import {SharedModule} from '../../shared/shared.module';
import {WechatRoutingModule} from './wechat-routing.module';
import { LoginComponent } from './login/login.component';
import { PcComponent } from './pc/pc.component';

@NgModule({
  declarations: [WechatComponent, LoginComponent, PcComponent],
  imports: [
    SharedModule,
    WechatRoutingModule
  ]
})
export class WechatModule { }
