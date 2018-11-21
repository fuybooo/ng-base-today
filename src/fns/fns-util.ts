/**
 * 对数组按照指定属性值进行排序
 * list 要排序的数组
 * field 要排序的字段
 * sortOrder 排序规则 asc: 正序(默认) desc: 倒序
 */

declare type orderType = 'asc' | 'desc';

export function sortObjectList(list, field, sortOrder: orderType = 'asc') {
  return [...list.sort((a, b) => {
    if (a[field] > b[field]) {
      return (sortOrder === 'asc') ? 1 : -1;
    } else if (a[field] < b[field]) {
      return (sortOrder === 'desc') ? 1 : -1;
    } else {
      return 0;
    }
  })];
}

/**
 * 获取安全路径
 * 如 /abc/bbc/ => /abc/bbc
 * 如 /abc/bbc => /abc/bbc
 */
export function getSafeStr(str: string) {
  return str.slice(-1) === '/' ? str.slice(0, str.length - 1) : str;
}

/**
 * 判断是否为空对象即 {}
 */
export function isEmptyObject(object) {
  return JSON.stringify(object) === '{}';
}

/**
 * 根据指定keys获取新的子数组，默认获取id数组
 * 例如 getValueList([{id: 'abc'}, {id: 'bbc'}]) => ['abc', 'bbc']
 * 例如 getValueList([{id: 'abc', name: 'n1'}, {id: 'bbc', name: 'n2'}], ['name']) => ['n1', 'n2']
 */
export function getValueListByKeys(list, keys: any = 'id') {
  if (typeof keys === 'string') {
    keys = [keys];
  }
  if (keys.length === 1) {
    return list.map(item => item[keys[0]]);
  } else {
    return list.map(item => {
      const value: any = {};
      keys.forEach(key => value[key] = item[key]);
      return value;
    });
  }
}

/**
 * 转换string和boolean
 */
export function switchSB(sb: string | boolean) {
  if (sb === '0') {
    return false;
  }
  if (sb === '1') {
    return true;
  }
  if (sb === true) {
    return '1';
  }
  if (sb === false) {
    return '0';
  }
}

/**
 * 生成uuid
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function trimList(list) {
  return [...list.filter(item => item !== '')];
}

/**
 * 将一维数组转换成2维数组
 * num表示每行的元素个数
 */
export function sliceArray(list: any[], num = 2) {
  return new Array(Math.ceil(list.length / num)).fill(0).map((item, i) => num === 1 ? list[i] : (new Array(num).fill(0).map((_item, j) => list[i * num + j])));
}

/**
 * 深度trim
 */
export function deepTrim(obj) {
  if (obj === null) {
    return '';
  }
  const newObj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else {
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        let objValue = obj[i];
        if (typeof objValue === 'string') {
          objValue = objValue.trim();
        }
        if (objValue === undefined || objValue === null) {
          objValue = '';
        }
        // 过滤为空的参数
        if (objValue === '') {
          continue;
        }
        newObj[i] = typeof objValue === 'object' ? deepTrim(objValue) : objValue;
      }
    }
  }
  return newObj;
}
export interface DateInterface {
  year: string | number;
  month: string | number;
  day?: string | number;
}
export function equalDay(date: Date, item: DateInterface) {
  return date.getFullYear() === +item.year
    && date.getMonth() + 1 === +item.month
    && date.getDate() === +item.day;
}

/**
 * 根据判断日期是否为周末
 */
export function isHoliday(date: Date) {
  return date.getDay() === 6 || date.getDay() === 0;
}

export function formatJson(json: any, options: any = {}) {
  let reg = null,
    formatted = '',
    pad = 0;
  const PADDING = '    ';
  options.newlineAfterColonIfBeforeBraceOrBracket = !!options.newlineAfterColonIfBeforeBraceOrBracket;
  options.spaceAfterColon = !!options.spaceAfterColon;
  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  } else {
    json = JSON.parse(json);
    json = JSON.stringify(json);
  }
  reg = /([\{\}])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /([\[\]])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /(\,)/g;
  json = json.replace(reg, '$1\r\n');
  reg = /(\r\n\r\n)/g;
  json = json.replace(reg, '\r\n');
  reg = /\r\n\,/g;
  json = json.replace(reg, ',');
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g;
    json = json.replace(reg, ':{');
    reg = /\:\r\n\[/g;
    json = json.replace(reg, ':[');
  }
  if (options.spaceAfterColon) {
    reg = /\:/g;
    json = json.replace(reg, ':');
  }
  (json.split('\r\n')).forEach(function (node: any, index: any) {
    let i = 0,
      indent = 0,
      padding = '';

    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1;
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += padding + node + '\r\n';
    pad += indent;
  });
  return formatted;
}

let compareRes = [];
/**
 * 比较两个简单对象的值，如果相同则返回true，否则返回false
 * 简单对象： key为string类型；值为 null, undefined, string, boolean, number, array, object
 * 支持 无限层级嵌套的对象，数组。
 * 有一个缺陷：要比较的数组的顺序必须保证一致。
 */
export function compareObj(objA: any, objB: any): boolean {
  compareRes = [];
  compare(objA, objB);
  return compareRes.every(item => item === true);
}

function compare(objA: any, objB: any) {
  if (objA === undefined || objA === null) {
    if (objB === undefined || objB === null) {
      compareRes.push(true);
    } else {
      compareRes.push(false);
    }
  } else {
    const typeA = typeof objA;
    const typeB = typeof objB;
    if (typeA === 'object') {
      if (typeB === 'object') {
        // 暂时只考虑 object 和 array
        const objTypeA = Object.prototype.toString.call(objA);
        const objTypeB = Object.prototype.toString.call(objB);
        if (objTypeA === objTypeB) {
          if (objTypeA === '[object Object]') {
            // 不能判断objA中的属性多还是objB中的属性多，所以进行两次循环
            for (const p in objA) {
              if (objA.hasOwnProperty(p)) {
                compare(objA[p], objB[p]);
              }
            }
            for (const p in objB) {
              if (objB.hasOwnProperty(p)) {
                compare(objB[p], objA[p]);
              }
            }
          } else if (objTypeA === '[object Array]') {
            for (let i = 0; i < objA.length; i ++) {
              compare(objA[i], objB[i]);
            }
            for (let i = 0; i < objB.length; i ++) {
              compare(objB[i], objA[i]);
            }
          }
        } else {
          compareRes.push(false);
        }
      } else {
        compareRes.push(false);
      }
    } else {
      // 此处typeA的可能值为 number boolean string (暂时只考虑这几种)
      if (objA === objB) {
        compareRes.push(true);
      } else {
        compareRes.push(false);
      }
    }
  }
}

/**
 * 根据key和value获取list中其他key对应的值
 */
export function getOtherValueOfListByField(list: any[], value: any, key: string, otherKey: string) {
  if (!list || value === '') {
    return '';
  }
  if (typeof value !== 'object') {
    value = [value];
  }
  return list.find(l => l[key] === value)[otherKey];
}
