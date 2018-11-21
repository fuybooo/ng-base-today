import {EventEmitter, Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/internal/operators';
import {LANG_INFO} from './local-storage/local-storage.namespace';
import {environment} from '../../environments/environment';
import {LocalStorageService} from './local-storage/local-storage.service';
import {TranslateService} from '@ngx-translate/core';
import {NzI18nService, zh_CN, en_US} from 'ng-zorro-antd';

@Injectable()
export class CoreService {
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
    private nzI18nService: NzI18nService
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
    });
  }
  initTranslateConfig() {
    const lang = this.getDefaultLang();
    this.translateService.addLangs(['zh', 'en']);
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
    }
    this.nzI18nService.setLocale(langFile);
  }
}
