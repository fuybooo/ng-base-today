export interface UrlConfig {
  url: string;
  isStatic?: boolean;
  isLogin?: boolean;
}
interface CommonUrl {
  login: UrlConfig;
  validRepeat: UrlConfig;
  testSelectServer: UrlConfig;
}
/**
 * 请求URL
 */
export const urls: CommonUrl = {
  login: {
    url: '/login',
    isStatic: true,
    isLogin: true
  },
  validRepeat: {
    url: '/validRepeat',
    isStatic: true,
  },
  testSelectServer: {
    url: '/testSelectServer',
    isStatic: true,
  },
};
