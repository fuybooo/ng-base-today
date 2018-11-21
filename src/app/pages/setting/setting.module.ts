import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {SettingComponent} from './setting.component';
import {SettingRoutingModule} from './setting-routing.module';
import {HttpService} from '../../core/http/http.service';
import {HttpInterceptorService} from '../../core/http/http-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    SharedModule,
    SettingRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    HttpService
  ]
})
export class SettingModule { }
