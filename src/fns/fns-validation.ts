/**
 * 验证控件的值是否符合要求
 * @param specialCharacter 特殊字符正则表达式
 * @param trueIsNotAllowFalseIsOnlyAllow 如何进行校验
 * true：正则匹配通过则字符串不符合要求 - 例如：验证控件不允许输入特殊字符
 * false：正则匹配不通过则字符串不符合要求 - 例如：验证控件只能输入某些字符
 */
import {FormControl} from '@angular/forms';

export function getSpecialCharacterValidator(specialCharacter: RegExp, trueIsNotAllowFalseIsOnlyAllow = true) {
  return function (control: FormControl) {
    let value: any;
    if (typeof control.value === 'number') {
      value = control.value + '';
    } else if (typeof control.value === 'string') {
      value = control.value;
    } else {
      value = '';
    }
    if (value && value.trim() !== '') {
      if (trueIsNotAllowFalseIsOnlyAllow) {
        if (specialCharacter.test(value.trim())) {
          return {error: true, mistake: true};
        } else {
          return null;
        }
      } else {
        if (!specialCharacter.test(value.trim())) {
          return {error: true, mistake: true};
        } else {
          return null;
        }
      }
    }
  };
}

export function getClientDuplicateValidator(list: any[], field = 'name', crtUid?) {
  return function (control: FormControl) {
    if (control && control.value && control.value.trim()) {
      if (list.some(item => item[field] === control.value && item.uid !== crtUid)) {
        return {error: true, duplicate: true};
      }
    }
  };
}
