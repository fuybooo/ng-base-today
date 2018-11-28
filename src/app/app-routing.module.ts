import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'wechat',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: './pages/main/main.module#MainModule'
  },
  {
    path: 'setting',
    loadChildren: './pages/setting/setting.module#SettingModule'
  },
  {
    path: 'wechat',
    loadChildren: './pages/wechat/wechat.module#WechatModule'
  },
  {
    path: 'setup',
    loadChildren: './pages/setup/setup.module#SetupModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
