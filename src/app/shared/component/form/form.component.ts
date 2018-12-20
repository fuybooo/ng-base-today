import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {findFormItem, FormConfigItem, FORMEVENT, FormRow} from './form.model';
import {CoreService} from '../../../core/core.service';
import {getOtherValueOfListByField} from '../../../../fns/fns-util';
import {getClientDuplicateValidator, getSpecialCharacterValidator} from '../../../../fns/fns-validation';
declare let $: any;
// declare let wangEditor: any;

/**
 * 适用任何的form表单
 * 示例
 * <app-form
 *   [formId]="formId"
 *   [(form)]="form"
 *   [formConfig]="formConfig"
 *   ></app-form>
 * form必须双向绑定
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() formId; // 表单唯一id，必传切唯一
  @Input() nzGutter = 30; // 横向间距，默认为30，在一行显示两列时起作用
  @Input() formConfig: any[]; // 主要配置项，必传
  @Input() form: FormGroup; // form表单主体，必传
  @Input() formType = ''; // form表单类型，默认为空，表示增改，可选为view，表示查看
  @Input() formSize = ''; // 表单大小，可选值： small
  @Input() formIsSpecial = false; // 表单是否是特殊
  @Input() formAuxConfig: any = {};
  @Input() isGlobalEvent; // 是否需要全局事件去发射form表单的变化 默认为false // todo 长时间无用的话将会删掉
  @Output() formChange = new EventEmitter(); // 表单变化事件
  // formDimension = 2; // 表单的维度
  defLabelSpan = 7;
  defSingleInputSpan = 14; // 每行显示一个时 input的宽度
  defMultipleInputSpan = 17; // 每行显示多个时 input的宽度
  defSelectUrl = '';
  timer;
  subscript;
  constructor(
    private fb: FormBuilder,
    private core: CoreService
  ) { }

  ngOnInit() {
    /**
     * 需要重置表单时
     */
    if (this.isGlobalEvent) {
      this.subscript = this.core.globalFormEvent.subscribe((event) => {
        if (event && event.formId === this.formId && event.type === FORMEVENT.RESET) {
          this.initForm();
        }
      });
    }
    this.initForm();
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }
  initForm() {
    // 根据formConfig 生成form
    const group: any = {};
    this.formConfig.forEach((row: any) => {
      if (!row.formConfigItem) {
        row.formConfigItem = row;
      }
      row.formConfigItem.forEach((col: any) => {
        if (col) {
          group[col.field] = [
            {value: col.defaultValue === 0 ? 0 : (col.defaultValue || null), disabled: col.disabled || this.formType === 'disable'},
            [...(col.validators && col.validators.length ? col.validators.map(validator => {
              switch (validator.type) {
                case 'required':
                  return Validators.required;
                case 'maxlength':
                  return Validators.maxLength(validator.value);
                case 'minlength':
                  return Validators.minLength(validator.value);
                case 'mistake':
                  return getSpecialCharacterValidator(validator.value, validator.notAllow);
                case 'duplicate':
                  return getClientDuplicateValidator(validator.value, validator.field, validator.uid);
              }
            }) : [])]
            // todo 这里可以加入远程重复校验
          ];
          /* 如果是选择器,且需要一个label字段时,则需要加上一个新字段 */
          if (col.type === 'commonSelect' && col.needLabel) {
            group[col.field + 'Label'] = [];
          }
          /* 如果是输入组,则需要将selectField加入进去 */
          if (col.type === 'inputGroup') {
            group[col.selectField] = [];
          }
        }
      });
    });
    this.form = this.fb.group(group);
    if (this.formIsSpecial) {
      this.initSpecialControl();
    }
    this.initFormAuxConfig();
    this.changeControl();
  }
  initSpecialControl() {
    // setTimeout(() => {
    //   const editor = new wangEditor(`#editor-${this.formId}`);
    //   editor.customConfig.onchange = (c) => {
    //     console.log('editor.change');
    //     const editorField = findFormItem(this.formConfig, 'editor', 'type').field;
    //     this.$control(editorField).setValue(c);
    //     this.$control(editorField).markAsDirty();
    //     this.changeControl();
    //   };
    //   editor.create();
    // }, 100);
  }
  initFormAuxConfig() {
    if (this.formConfig[0].length === 1) {
      this.formAuxConfig.inputSpan = this.formAuxConfig.inputSpan || this.defSingleInputSpan;
    } else {
      this.formAuxConfig.inputSpan = this.formAuxConfig.inputSpan || this.defMultipleInputSpan;
    }
    this.formAuxConfig.labelSpan = this.formAuxConfig.labelSpan || this.defLabelSpan;
  }
  changeControl() {
    this.formChange.emit(this.form);
  }
  $control(name) {
    return this.form.controls[name];
  }
  $(name) {
    return this.$control(name).value;
  }
  isRequired(col) {
    return this.formType === 'view' || col.colType === 'view' ? false : (col.validators ? col.validators.some(v => v.type === 'required') : false);
  }
  getValidatorText(v) {
    switch (v.type) {
      case 'required':
        return '必填项不能为空';
      case 'maxlength':
        return '最多输入' + v.value + '位';
      case 'minlength':
        return '最少输入' + v.value + '位';
      case 'mistake':
        return '输入不合规范';
      case 'duplicate':
        return '输入内容已存在';
    }
  }
  fileChange(file, col) {
    this.$control(col.field).setValue(file.files);
    this.form.markAsDirty();
    this.changeControl();
  }
  getViewValue(col) {
    if (col.isEmpty) {
      return '无';
    }
    switch (col.type) {
      case 'checkbox':
      case 'radio':
        return this.$(col.field) ? col.viewTrueValue || '是' : col.viewFalseValue || '否';
      default:
        return this.$(col.field);
    }
  }

  /**
   * 改变选择器时向外传值
   */
  changeSelectedItem(value, col) {
    this.$control(col.field).setValue(value[col.optionValue]);
    if (col.needLabel) {
      this.$control(col.field + 'Label').setValue(value[col.optionLabel]);
    }
    this.$control(col.field).markAsDirty();
    this.changeControl();
  }

  /**
   * 改变输入组中选择器变化时
   */
  changeGroupSelectedItem(value, col) {

  }
}
