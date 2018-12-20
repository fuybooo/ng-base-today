import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {getMaxSort, guid, sortObjectList} from '../../../../fns/fns-util';
import {Column} from '../../../shared/component/table/table.model';
import {CoreService} from '../../../core/core.service';
import {LOTTERY_PARTICIPANT, LOTTERY_PRIZE, LOTTERY_WINNER} from '../../../core/local-storage/local-storage.namespace';
import {LocalStorageService} from '../../../core/local-storage/local-storage.service';
import {EVENTS} from '../../../core/core.namespace';
import {prizeList} from './setting.model';
import {NzModalService} from 'ng-zorro-antd';
import {FormGroup} from '@angular/forms';
import {findFormItem, FormConfigItem, FORMEVENT, FormRow} from '../../../shared/component/form/form.model';
import {Router} from '@angular/router';
import {REGEXP} from '../../../core/common/common.model';
import {PrizeFormComponent} from './prize-form/prize-form.component';
import {getModalFooter} from '../../../../fns/fns-project';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {
  @ViewChild('contentTpl') contentTpl: ElementRef;
  @ViewChild('footerTpl') footerTpl: ElementRef;
  tableId1 = guid();
  tableId2 = guid();
  tableId3 = guid();
  columns: Column[] = [
    {
      title: '姓名',
      field: 'name',
    },
    {
      title: '机构部门',
      field: 'dept'
    },
    {
      event: ['delete'],
      text: ['删除']
    }
  ];
  prizeColumns: Column[] = [
    {
      title: '排序',
      formatter: 'prize-sort'
    },
    {
      title: '奖项',
      field: 'prize'
    },
    {
      title: '数量',
      field: 'num'
    },
    {
      event: ['delete', 'pop-edit'],
      text: ['删除', '编辑']
    }
  ];
  prizeList = [];
  config = {
    list: [
      {
        label: '参与名单'
      }
    ]
  };
  keyword;
  participantList = [];
  winnerList = [];
  winnerColumns: Column[] = [
    {
      title: '奖项',
      field: 'prize'
    },
    {
      title: '姓名',
      field: 'name'
    },
  ];
  modalInstance;
  constructor(
    private core: CoreService,
    private store: LocalStorageService,
    private modal: NzModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.winnerList = this.store.get(LOTTERY_WINNER) || [];
    this.search(1);
    this.search(3);
    // 导入数据之后刷新页面
    this.core.commonEvent.subscribe(event => {
      if (event === EVENTS.LOTTERY_REFRESH) {
        this.search(1);
      }
    });
  }
  popPrize(op = 'add', data?) {
    this.modalInstance = this.modal.create({
      nzTitle: op === 'add' ? '新增奖项' : '编辑奖项',
      nzComponentParams: {
        formData: data
      },
      nzContent: PrizeFormComponent,
      nzFooter: getModalFooter(_modal => {
        if (op === 'add') {
          this.prizeList = [
            ...this.prizeList,
            {
              ..._modal.form.value,
              uid: guid(),
              sort: getMaxSort(this.prizeList) + 1
            }];
        } else if (op === 'edit') {
          const prizeForm = _modal.form.value;
          this.prizeList = [...this.prizeList.map(item => {
            if (item.uid === _modal.form.value.uid) {
              return {
                ...item,
                ...prizeForm
              };
            } else {
              return item;
            }
          })];
        }
        this.store.set(LOTTERY_PRIZE, this.prizeList);
        this.destroyModal();
        this.search(3);
      }, () => this.modalInstance.destroy(), true)
    });
  }
  search(type) {
    if (type === 1) {
      this.participantList = this.store.get(LOTTERY_PARTICIPANT);
      if (this.keyword) {
        this.participantList = this.participantList.filter(item => item.name.includes(this.keyword));
      }
      this.core.globalTableEvent.emit({
        tableId: this[`tableId${type}`],
        dataSet: this.participantList
      });
    } else if (type === 3) {
      this.prizeList = this.store.get(LOTTERY_PRIZE);
      if (!this.prizeList) {
        this.prizeList = prizeList.map(item => {
          return {
            ...item,
            uid: guid()
          };
        });
        this.store.set(LOTTERY_PRIZE, this.prizeList);
      }
      // 对prizeList进行排序
      this.prizeList = sortObjectList(this.prizeList, 'sort');
      this.core.globalTableEvent.emit({
        tableId: this[`tableId${type}`],
        dataSet: this.prizeList
      });
    }
  }
  back() {
    this.router.navigateByUrl('/lottery');
  }
  searchWordChange($event) {
    this.keyword = $event;
  }
  eventChange(event) {
    // 删除参与者
    if (event.tableId === this.tableId1) {
      if (event.event === 'delete') {
        this.participantList = [...this.participantList.filter(item => item.name !== event.data.name)];
        this.store.set(LOTTERY_PARTICIPANT, this.participantList);
        this.search(1);
      }
    } else if (event.tableId === this.tableId3) {
      // 奖项
      if (event.event === 'delete') {
        this.prizeList = [...this.prizeList.filter(item => item.uid !== event.data.uid)];
        this.store.set(LOTTERY_PRIZE, this.prizeList);
        this.search(3);
      } else if (event.event === 'pop-edit') {
        this.popPrize('edit', event.data);
      } else if (event.event.includes('sort-')) {
        // 排序
        const crtPrize = this.prizeList.find((item, i) => i === event.index);
        if (event.event === 'sort-up') {
          const prePrize = this.prizeList.find((item, i) => i === event.index - 1);
          crtPrize.sort = crtPrize.sort - 1;
          prePrize.sort = prePrize.sort + 1;
        } else if (event.event === 'sort-down') {
          const nextPrize = this.prizeList.find((item, i) => i === event.index + 1);
          crtPrize.sort = crtPrize.sort + 1;
          nextPrize.sort = nextPrize.sort - 1;
        }
        this.store.set(LOTTERY_PRIZE, this.prizeList);
        this.search(3);
      }
    }
  }
  clear() {
    this.winnerList = [];
    this.store.set(LOTTERY_WINNER, []);
  }
  destroyModal() {
    this.modalInstance.destroy();
  }
}
