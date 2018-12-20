import {Component, Input, OnInit} from '@angular/core';
import {findFormItem, FormConfigItem, FORMEVENT, simpleSetForm} from '../../../../shared/component/form/form.model';
import {guid} from '../../../../../fns/fns-util';
import {REGEXP} from '../../../../core/common/common.model';
import {FormGroup} from '@angular/forms';
import {CoreService} from '../../../../core/core.service';
import {LOTTERY_PRIZE} from '../../../../core/local-storage/local-storage.namespace';
import {LocalStorageService} from '../../../../core/local-storage/local-storage.service';

@Component({
  selector: 'app-prize-form',
  templateUrl: './prize-form.component.html',
  styleUrls: ['./prize-form.component.less']
})
export class PrizeFormComponent implements OnInit {
  @Input() formData;
  formId = guid();
  form = new FormGroup({});
  formConfig: FormConfigItem[][] = [
    [
      {
        field: 'uid',
        hidden: true
      }
    ],
    [
      {
        label: '奖项',
        field: 'prize',
        validators: [
          {
            type: 'duplicate',
          },
          {
            type: 'required',
          },
          {
            type: 'minlength',
            value: 2
          },
          {
            type: 'maxlength',
            value: 6
          },
          {
            type: 'mistake',
            value: REGEXP.onlyCh,
            notAllow: false
          },
        ]
      },
    ],
    [
      {
        type: 'number',
        label: '数量',
        field: 'num',
        validators: [
          {
            type: 'required',
          },
          {
            type: 'mistake',
            value: REGEXP.num1_99,
            notAllow: false
          },
        ]
      }
    ]
  ];
  constructor(
    private core: CoreService,
    private store: LocalStorageService
  ) { }

  ngOnInit() {
    // 设置重复验证项的list
    if (this.formData) {
      simpleSetForm(this.formConfig, this.formData);
    }
    const validatorItem = findFormItem(this.formConfig, 'prize').validators.find(item => item.type === 'duplicate');
    validatorItem.value = this.store.get(LOTTERY_PRIZE);
    validatorItem.field = 'prize';
    if (this.formData) {
      validatorItem.uid = this.formData.uid;
    }
    this.core.globalFormEvent.emit({
      formId: this.formId,
      type: FORMEVENT.RESET
    });
  }

}
