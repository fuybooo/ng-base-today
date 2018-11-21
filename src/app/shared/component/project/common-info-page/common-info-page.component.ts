import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormConfigItem, FormRow, simpleSetForm} from '../../form/form.model';
import {NzMessageService} from 'ng-zorro-antd';
import {UrlConfig} from '../../../../core/http/http-url.model';
import {guid} from '../../../../../fns/fns-util';
import {AJAXTYPE, HttpRes} from '../../../../core/common/common.model';
import {HttpService} from '../../../../core/http/http.service';

/**
 * 公共的页面详情
 * 视项目的不同而不同
 */
@Component({
  selector: 'app-common-info-page',
  templateUrl: './common-info-page.component.html',
  styleUrls: ['./common-info-page.component.less']
})
export class CommonInfoPageComponent implements OnInit {
  @Input() formConfig: FormConfigItem[][] | FormRow[];
  @Input() backUrl: string;
  @Input() url: UrlConfig;
  op;
  id;
  titleText;
  showForm = false;
  formId = guid();
  form = new FormGroup({});
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.op = this.route.snapshot.params.op;
    this.id = this.route.snapshot.params.id;
    if (this.op === 'add') {
      this.titleText = '新增';
      this.showForm = true;
      // 新增时需要初始化表单
    } else if (this.op === 'edit') {
      this.titleText = '编辑';
      this.searchInfoDetail();
    }
  }
  searchInfoDetail() {
    this.http.get(this.url, {id: this.id}).subscribe((res: HttpRes) => {
      if (res.code === 200) {
        const value = res.data.results[0][0];
        simpleSetForm(this.formConfig, value);
        this.showForm = true;
      }
    });
  }
  save() {
    const ajaxType = this.op === 'add' ? AJAXTYPE.POST : AJAXTYPE.PUT;
    const params = {...this.form.value, id: this.id};
    this.http.ajax(this.url, params, ajaxType).subscribe((res: HttpRes) => {
      if (res.code === 200) {
        this.message.success('操作成功');
        this.back();
      } else {
        this.message.error('操作失败');
      }
    });
  }
  back() {
    this.router.navigateByUrl(this.backUrl);
  }

}
