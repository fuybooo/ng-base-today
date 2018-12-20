import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ImportFileComponent} from '../component/project/import-file/import-file.component';
import {getModalFooter} from '../../../fns/fns-project';
import * as XLSX from 'xlsx';
import {LocalStorageService} from '../../core/local-storage/local-storage.service';
import {LOTTERY_PARTICIPANT} from '../../core/local-storage/local-storage.namespace';
import {CoreService} from '../../core/core.service';

@Directive({selector: '[appPopImport]'})
export class PopImportDirective {
  @Input() config: any = {};
  @HostListener('click') onClick() {
    const modal = this.modal.create({
      nzTitle: '批量导入',
      nzWidth: 700,
      nzContent: ImportFileComponent,
      nzComponentParams: this.config,
      nzFooter: getModalFooter(_modal => {
        const file = _modal.list[0];
        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
          const data = e.target.result;
          const wb = XLSX.read(data, {type: 'binary'});
          // 取出对应的值
          let dataSet = [];
          const sheet1 = wb.Sheets.Sheet1;
          if (!(sheet1.A1 && sheet1.A1.v === '姓名' && sheet1.B1 && sheet1.B1.v === '机构部门')) {
            this.message.error('请上传正确的excel');
            return;
          }
          delete wb.Sheets.Sheet1.A1;
          delete wb.Sheets.Sheet1.B1;
          const nameList = [];
          const deptList = [];
          for (let p in wb.Sheets.Sheet1) {
            if (p.includes('A')) {
              nameList.push(wb.Sheets.Sheet1[p].v);
            }
            if (p.includes('B')) {
              deptList.push(wb.Sheets.Sheet1[p].v);
            }
          }
          nameList.forEach((item, i) => {
            dataSet.push({
              name: item,
              dept: deptList[i]
            });
          });
          this.store.set(LOTTERY_PARTICIPANT, dataSet);
          this.message.success('导入成功！');
          // 导入成功之后需要刷新页面
          this.core.commonEvent.emit();
          modal.destroy();
        };
        fileReader.readAsBinaryString(file.file);
      }, () => modal.destroy(), true, 'form', _modal => _modal ? (_modal.list ? !_modal.list.some(l => l.file) : true) : true)
    });
  }
  constructor(
    private elementRef: ElementRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private core: CoreService,
    private store: LocalStorageService
  ) {}
}
