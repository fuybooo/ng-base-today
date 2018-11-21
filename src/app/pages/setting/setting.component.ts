import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {guid} from '../../../fns/fns-util';
import {FormConfigItem} from '../../shared/component/form/form.model';
import {urls} from '../../core/http/http-url.model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {
  formId = guid();
  form = new FormGroup({});
  formConfig: FormConfigItem[][] = [
    [
      {
        label: '用户名称',
        field: 'username'
      }
    ],
    [
      {
        type: 'commonSelect',
        label: '选择服务器',
        field: 'selectServer',
        url: urls.testSelectServer,
        optionValue: 'code',
        optionLabel: 'fn-common'
      }
    ],
    [
      {
        type: 'commonSelect',
        label: '选择本地',
        field: 'selectClient',
        optionValue: 'code',
        optionLabel: 'fn-common',
        isNotServerSearch: true,
        list: [
          {
            code: '001',
            name: '张三'
          },
          {
            code: '002',
            name: '张四'
          },
          {
            code: '003',
            name: '张五'
          },
        ]
      }
    ],
    [
      {
        type: 'inputGroup',
        label: '输入框组合',
        field: 'cardNum',
        selectField: 'type',
        optionValue: 'code',
        optionLabel: 'fn-common',
        isNotServerSearch: true,
        list: [
          {
            code: '001',
            name: '张三'
          },
          {
            code: '002',
            name: '张四'
          },
          {
            code: '003',
            name: '张五'
          },
        ]
      }
    ],
  ];
  constructor() { }

  ngOnInit() {
  }

}
