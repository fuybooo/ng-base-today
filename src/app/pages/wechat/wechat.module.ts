import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WechatComponent } from './wechat.component';
import {SharedModule} from '../../shared/shared.module';
import {WechatRoutingModule} from './wechat-routing.module';

@NgModule({
  declarations: [WechatComponent],
  imports: [
    SharedModule,
    WechatRoutingModule
  ]
})
export class WechatModule { }
