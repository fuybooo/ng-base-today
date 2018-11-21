import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UrlConfig, urls} from './http-url.model';
import {isEmptyObject} from '../../../fns/fns-util';
import {getCommonParams, getUrl} from './http-fns';
import {AJAXTYPE, HttpRes} from '../common/common.model';
import {FormControl, ValidationErrors} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
const defaultCommonParams = {
  pageNumber: 1,
  pageSize: 10,
  sortField: '',
  sortOrder: '',
};
@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}
  get(urlConfig: UrlConfig, params: any = {}, commonParams: any = {}) {
    params.IIP = true; // 根据项目需求而定,有的项目在params中传递id,有的在url上拼接id
    const common = isEmptyObject(commonParams) ? {} : {
      ...defaultCommonParams, ...commonParams
    };
    // IIP 表示idInParams id参数是否可以在参数中存在，默认为false，表示id需要拼接在url后面，为true时参数中存在id，url中不存在id
    // 根据不同项目采取不同配置,有的项目请求都用post,通过method匹配不同的controller
    return this.http.post(getUrl(urlConfig, params.IIP ? undefined : params.id), getCommonParams({...params, ...common}));
  }
  post(urlConfig: UrlConfig, params: any = {}) {
    params.IIP = true;
    return this.http.post(getUrl(urlConfig, params.IIP ? undefined : params.id), getCommonParams(params, AJAXTYPE.POST, urlConfig.isLogin));
  }
  put(urlConfig: UrlConfig, params: any = {}) {
    params.IIP = true;
    return this.http.post(getUrl(urlConfig, params.IIP ? undefined : params.id), getCommonParams(params, AJAXTYPE.PUT, urlConfig.isLogin));
  }
  delete(urlConfig: UrlConfig, params: any = {}) {
    params.IIP = true;
    return this.http.post(getUrl(urlConfig, params.IIP ? undefined : params.id), getCommonParams(params, AJAXTYPE.DELETE, urlConfig.isLogin));
  }
  ajax(urlConfig: UrlConfig, type = AJAXTYPE.GET, params: any = {}, commonParams: any = {}) {
    params.IIP = true;
    if (type === AJAXTYPE.GET) {
      return this.get(urlConfig, params, commonParams);
    } else if (type === AJAXTYPE.POST) {
      return this.post(urlConfig, params);
    } else if (type === AJAXTYPE.PUT) {
      return this.put(urlConfig, params);
    } else if (type === AJAXTYPE.DELETE) {
      return this.delete(urlConfig, params);
    }
  }
  syncValidators(config: any = {}) {
    config = {...{
      url: urls.validRepeat,
      field: 'value'
    }, ...config};
    return (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
      this.get(config.url, {
        [config.field]: (control.value && control.value.trim()) || '',
      }).subscribe((res: HttpRes) => {
        if (res.code === '200') {
          observer.next(null);
        } else {
          observer.next({error: true, duplicated: true});
        }
        observer.complete();
      });
    });
  }
}
