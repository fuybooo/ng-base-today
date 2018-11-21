import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    // 获取登录信息，判断登录信息是否存在
    const loginInfo = true;
    if (loginInfo) {
      return true;
    } else {
      this.router.navigateByUrl('/index');
    }
  }
}
