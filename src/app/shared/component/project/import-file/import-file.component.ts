import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.less']
})
export class ImportFileComponent implements OnInit {
  @Input() list: any[];
  defSuffixList = ['xls', 'xlsx'];
  constructor(
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.list.forEach(item => delete item.file);
  }
  changeFile(i, fileInput) {
    const file = fileInput.files[0];
    const validFileType = (this.list[i].suffixList || this.defSuffixList).some(item => file.name.endsWith('.' + item));
    const validFileSize = file.size <= (this.list[i].size || 1024000);
    if (file && validFileType && validFileSize) {
      this.list[i].file = file;
    } else {
      if (!validFileType) {
        this.message.error('文件类型错误');
      } else if (!validFileSize) {
        this.message.error('文件过大');
      }
      this.list[i].file = null;
      return false;
    }
  }
  downTemplate() {
    // window.location.href = this.downloadUrl;
    // 下载固定模板template
    window.location.href = 'data:application/vnd.ms-excel;base64,' + window.btoa(window['unescape'](window['encodeURIComponent'](`
      <html>
          <head>
              <meta charset="UTF-8">
              <style type="text/css">
                  body, html {background-color: transparent;}
                  table {border-collapse:collapse;border:thin solid #999;}
                  td {border:thin solid #999;text-align: center;}
                  .bold {font-weight: bold;}
              </style>
          </head>
          <body>
              <table cellspacing="0" cellpadding="0" border="1">
                  <tr class="bold">
                      <td>${'姓名'}</td>
                      <td>${'机构部门'}</td>
                      ${Array(8).fill(`<td></td>`).join('')}
                  </tr>
                  ${Array(100).fill(`<tr>${Array(10).fill(`<td></td>`).join('')}</tr>`).join('')}
              </table>
          </body>
      </html>
  `)));
  }
}
