import {UrlConfig} from './http-url.model';
import {environment} from '../../../environments/environment';
import {deepTrim, getSafeStr} from '../../../fns/fns-util';
import {API_PATH} from '../local-storage/local-storage.namespace';
import {AJAXTYPE} from '../common/common.model';

/**
 * 获取公共参数,根据不同项目,采取不同策略
 */
export function getCommonParams(params, method = AJAXTYPE.GET, isLogin = false) {
  delete params.IIP; // iip 表示 id in params
  delete params.sqls; // iip 表示 id in params
  return {
    data: JSON.stringify(deepTrim(params)),
    method,
  };
}

export function getUrl(urlConfig: UrlConfig, urlId?): string {
  // 请求服务器的地址
  let path = getSafeStr(environment.apiPath);
  // 在开发模式下,根据调试者输入的服务器地址请求服务器
  const localStorage_apiPath = localStorage.getItem(API_PATH);
  if (environment.apiPathChangeable && localStorage && localStorage_apiPath) {
    environment.apiPath = path = getSafeStr(localStorage_apiPath);
  }
  const url = urlConfig.url + (urlId === undefined || urlId === '' ? '' : `/${urlId}`);
  const staticUrl = environment.deployPath + '/assets/mock' + url + '.json';
  const serverUrl = path + url + '/';
  return environment.isForceServer ? serverUrl :
    (environment.isForceStatic ? staticUrl :
      (urlConfig.isStatic ? staticUrl : serverUrl));
}

