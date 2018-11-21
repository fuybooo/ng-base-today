import {Component, Input, OnInit} from '@angular/core';
import {CoreService} from '../../../../core/core.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {HttpService} from '../../../../core/http/http.service';
import {guid} from '../../../../../fns/fns-util';
import {HttpRes} from '../../../../core/common/common.model';
/**
 * 公共的页面展示
 * 视项目的不同而不同
 */
@Component({
  selector: 'app-common-page',
  templateUrl: './common-page.component.html',
  styleUrls: ['./common-page.component.less']
})
export class CommonPageComponent implements OnInit {
  @Input() columns;
  @Input() url;
  @Input() addNavigateUrl;
  tableId = guid();
  checkedList = [];
  constructor(
    private core: CoreService,
    private router: Router,
    private http: HttpService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
  }

  /**
   * 监听搜索框值的变化进行搜索
   * 索索关键字变化之后直接进行搜索会导致请求频繁，和响应不按顺序。比如我先搜素1，响应时间为2s，再搜索12响应时间为0.1s则会导致我输入完12后，得到的结果确实1的搜索结果
   * 为了解决上述两个问题，需要使用rxjs中的两个方法 switchMap和debounce
   */
  search(value = '') {
    this.core.globalTableEvent.emit({
      tableId: this.tableId,
      isNeedSearchChange: true,
      params: {kw: value}
    });
  }
  add() {
    this.router.navigateByUrl(this.addNavigateUrl);
  }
  del(id?) {
    const params = {idList: id ? [id] : this.checkedList.map(item => item.id)};
    this.http.delete(this.url,
      params,
    ).subscribe((res: HttpRes) => {
      if (res.code === 200) {
        this.message.success('删除成功');
        this.search();
      }
    });
  }
  eventChange(event) {
    if (event.tableId === this.tableId) {
      if (event.event === 'delete') {
        this.del(event.data.id);
      }
    }
  }
  refreshStatusChange(event) {
    if (event.tableId === this.tableId) {
      this.checkedList = event.dataSet.filter(item => item.checked);
    }
  }

}
