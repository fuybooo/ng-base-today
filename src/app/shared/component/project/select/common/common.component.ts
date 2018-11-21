import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/internal/operators';
import {UrlConfig, urls} from '../../../../../core/http/http-url.model';
import {HttpService} from '../../../../../core/http/http.service';
import {HttpRes} from '../../../../../core/common/common.model';
import {getOtherValueOfListByField} from '../../../../../../fns/fns-util';

@Component({
  selector: 'app-select-common',
  templateUrl: './common.component.html',
})
export class CommonComponent implements OnInit {
  @Input() nzValue = 'id';
  @Input() nzLabel = 'fn-user';
  @Input() extLabelField = ''; // 额外的数据，有的选择框需要用到第三个字段
  @Input() valueKey = 'kw';
  @Input() url: UrlConfig = urls.login; // 默认查询用户数据
  @Input() special;
  @Input() selectedItem;
  @Input() serverSearch = true;
  @Input() placeholder = '可以输入关键字搜索哦...';
  @Input() list = [];
  @Output() selectedItemChange = new EventEmitter();
  @Output() extLabelFieldChange = new EventEmitter();
  searchChange$ = new BehaviorSubject('');
  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    if (this.serverSearch) {
      // 订阅搜索事件
      this.subSearch();
      // 初次搜索
      this.onSearch();
    }
  }
  subSearch() {
    const getList = (value: string) => {
      const params = {
        [this.valueKey]: value,
        pageSize: 10,
        pageNumber: 1,
        needNotTotal: true,
        special: this.special
      };
      return this.http.get(this.url, params, {pageNumber: 1, pageSize: 10});
    };
    this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getList)).subscribe((res: HttpRes) => {
      if (res.code === '200') {
        this.list = res.data.results;
      }
    });
  }
  onSearch(value?) {
    this.searchChange$.next(value);
  }
  getNzLabel(o) {
    if (!o) {
      return null;
    }
    if (this.nzLabel.startsWith('fn-')) {
      if (this.nzLabel === 'fn-user') {
        return o.name + '（' + o.loginname + '）';
      } else if (this.nzLabel === 'fn-common') {
        return o.name + '（' + o.code + '）';
      }
    }
    return o[this.nzLabel];
  }
  onChange(value) {
    // 将整个对象发送出去
    this.selectedItemChange.emit(getOtherValueOfListByField(this.list, value, this.nzValue, this.nzLabel));
    if (this.extLabelField) {
      this.extLabelFieldChange.emit(this.list.find(l => l[this.nzValue] === value)[this.extLabelField]);
    }
  }
}
