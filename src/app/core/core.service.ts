import {EventEmitter, Injectable} from '@angular/core';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/internal/operators';
import {LANG_INFO} from './local-storage/local-storage.namespace';
import {environment} from '../../environments/environment';
import {LocalStorageService} from './local-storage/local-storage.service';
import {TranslateService} from '@ngx-translate/core';
import {NzI18nService, zh_CN, en_US, zh_TW, NzModalService} from 'ng-zorro-antd';
import {Error} from 'tslint/lib/error';

const langs = ['zh', 'en', 'tw'];

@Injectable()
export class CoreService {
  commonEvent = new EventEmitter();
  pageHeightEvent = new EventEmitter();
  globalFormEvent = new EventEmitter();
  globalTableEvent = new EventEmitter();
  routeChangeEvent = new EventEmitter();
  menuTreeEvent = new EventEmitter();
  constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    private translateService: TranslateService,
    private title: Title,
    private nzI18nService: NzI18nService,
    private modalService: NzModalService
  ) {}
  getDefaultLang() {
    const localLang = this.store.get(LANG_INFO);
    const lang = localLang || environment.lang;
    if (lang !== localLang) {
      this.store.set(LANG_INFO, lang);
    }
    return lang;
  }
  getDomSanitizer(content, type = 'url') {
    switch (type) {
      case 'url':
        return this.domSanitizer.bypassSecurityTrustUrl(content);
      case 'html':
        return this.domSanitizer.bypassSecurityTrustHtml(content);
      case 'resource':
        return this.domSanitizer.bypassSecurityTrustResourceUrl(content);
      case 'script':
        return this.domSanitizer.bypassSecurityTrustScript(content);
      case 'style':
        return this.domSanitizer.bypassSecurityTrustStyle(content);
    }
  }
  watchRoute() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe(route => {
      this.routeChangeEvent.emit();
      this.modalService.closeAll();
      this.title.setTitle(route.snapshot.data.title);
    });
  }
  initTranslateConfig() {
    this.translateService.addLangs(langs);
    this.setDefaultLang();
  }
  changeLang(lang) {
    if (langs.includes(lang)) {
      this.store.set(LANG_INFO, lang);
      this.setDefaultLang();
    } else {
      throw new Error(`语言设置超出范围，不能设置${lang}，请选择"${langs.join('，')}"中的一种进行设置`);
    }
  }
  setDefaultLang() {
    const lang = this.getDefaultLang();
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    let langFile;
    switch (lang) {
      case 'zh':
        langFile = zh_CN;
        break;
      case 'en':
        langFile = en_US;
        break;
      case 'tw':
        langFile = zh_TW;
        break;
    }
    this.nzI18nService.setLocale(langFile);
  }
}
