import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {guid} from '../../../../fns/fns-util';
import {CoreService} from '../../../core/core.service';
declare let $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  isValid = true;
  invalidTimer;
  isTransition = false;
  showLogin = false;
  autoLoginEvent = new EventEmitter();
  constructor(
    private router: Router,
    private core: CoreService
    ) { }

  ngOnInit() {
    this.init();
    this.autoInvalid();
    // 自动显示登录按钮
    this.autoLoginEvent.subscribe(() => {
      setTimeout(() => {
        this.showLogin = true;
        this.autoInvalid();
      }, 3000);
    });
  }
  autoInvalid() {
    // 每5秒之后自动失效
    this.invalidTimer = setInterval(() => {
      if (!this.showLogin) {
        this.isValid = false;
        clearInterval(this.invalidTimer);
      }
    }, 5000);
  }
  getQrcode() {
    // 二维码
    setTimeout(() => {
      $('#js-login-qr').empty().qrcode({
        width: 270,
        height: 270,
        text: 'http://wx2.qq.com/' + guid()
      });
    }, 1);
  }
  init() {
    this.isValid = true;
    this.isTransition = false;
    this.showLogin = false;
    this.getQrcode();
    this.autoInvalid();
  }
  login() {
    this.router.navigateByUrl('/wechat');
  }
  refreshQr() {
    // 开始旋转
    this.isTransition = true;
    // 0.5秒之后旋转完成，刷新完成
    setTimeout(() => {
      this.isValid = true;
      this.autoLoginEvent.emit();
    }, 500);
    // 1秒之后允许再次旋转
    setTimeout(() => {
      this.isTransition = false;
    }, 1000);
  }
  changeLang(lang) {
    this.core.changeLang(lang);
  }
  toPc() {
    this.router.navigateByUrl('/wechat/pc');
  }
}
