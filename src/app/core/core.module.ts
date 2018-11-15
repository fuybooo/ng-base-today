import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, NZ_MESSAGE_CONFIG, zh_CN} from 'ng-zorro-antd';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HttpInterceptorService} from './services/http-interceptor.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {environment} from '../../environments/environment';
import {LocalStorageService} from './services/local-storage.service';
import {InitGuardService} from './services/init-guard.service';
const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, environment.deployPath + '/assets/i18n/', '.json');

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [PageNotFoundComponent],
  exports: [PageNotFoundComponent],
  providers: [
    // ng-zorro的全局设置
    {provide: NZ_MESSAGE_CONFIG, useValue: {nzMaxStack: 1} },
    {provide: NZ_I18N, useValue: zh_CN},
    // http拦截器
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    LocalStorageService,
    InitGuardService
  ]
})
export class CoreModule { }
