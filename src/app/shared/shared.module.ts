import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ButtonClickDirective} from './directive/button-click.directive';
import {ScrollbarDirective} from './directive/scrollbar.directive';
import {UnlessDirective} from './directive/unless.directive';
import {FormComponent} from './component/form/form.component';
import {CommonInfoPageComponent} from './component/project/common-info-page/common-info-page.component';
import {CommonPageComponent} from './component/project/common-page/common-page.component';
import {ImportFileComponent} from './component/project/import-file/import-file.component';
import {CommonComponent} from './component/project/select/common/common.component';
import {SearchComponent} from './component/search/search.component';
import {TableCellComponent} from './component/table/table-cell/table-cell.component';
import {TableFormatterComponent} from './component/table/table-formatter/table-formatter.component';
import {TableComponent} from './component/table/table.component';
import {TranslateModule} from '@ngx-translate/core';
import {PopImportDirective} from './directive/pop-import.directive';

/**
 * 共享模块
 */
@NgModule({
  imports: [
    // 官方模块
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // 第三方模块
    NgZorroAntdModule,
    TranslateModule
  ],
  declarations: [
    ButtonClickDirective,
    ScrollbarDirective,
    UnlessDirective,
    PopImportDirective,
    FormComponent,
    CommonInfoPageComponent,
    CommonPageComponent,
    ImportFileComponent,
    CommonComponent,
    SearchComponent,
    TableCellComponent,
    TableFormatterComponent,
    TableComponent
  ],
  entryComponents: [
    ImportFileComponent
  ],
  exports: [
    // 官方模块
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // 第三方模块
    NgZorroAntdModule,
    TranslateModule,
    // 本地指令
    ButtonClickDirective,
    ScrollbarDirective,
    UnlessDirective,
    PopImportDirective,
    FormComponent,
    CommonInfoPageComponent,
    CommonPageComponent,
    ImportFileComponent,
    CommonComponent,
    SearchComponent,
    TableCellComponent,
    TableFormatterComponent,
    TableComponent
  ]
})
export class SharedModule { }
