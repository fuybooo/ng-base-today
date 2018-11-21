import {Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {List} from '../../../../../domain/list.model';
import {NzDropdownContextComponent, NzDropdownService, NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Subject} from 'rxjs';
import {ListService} from '../../../../services/list.service';
import {TodoService} from '../../../../services/todo.service';
import {takeUntil} from 'rxjs/internal/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() isCollapsed;
  @ViewChild('listRenameInput') private listRenameInput: ElementRef;
  @ViewChild('listInput') private listInput: ElementRef;
  crtListUid = 'today';
  contextListUid: string;
  lists: List[] = [];
  addListModalVisible = false;
  renameListModalVisible = false;

  private dropdown: NzDropdownContextComponent;
  private destroy$ = new Subject();
  constructor(
    private dropdownService: NzDropdownService,
    private listService: ListService,
    private todoService: TodoService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // 订阅参数
    this.route.paramMap.subscribe((res: any) => {
      if (res.params.listUid) {
        this.crtListUid = res.params.listUid;
        this.listService.setCurrentUid(this.crtListUid);
      }
    });
    this.listService.lists$.pipe(takeUntil(this.destroy$))
      .subscribe(lists => this.lists = lists);
    this.listService.currentUid$.pipe(takeUntil(this.destroy$))
      .subscribe(uid => this.contextListUid = uid);
    this.listService.getAll();
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  closeAddListModal(): void {
    this.addListModalVisible = false;
  }
  closeRenameListModal(): void {
    this.renameListModalVisible = false;
  }
  openAddListModal(): void {
    this.addListModalVisible = true;
    setTimeout(() => this.listInput.nativeElement.focus());
  }
  openRenameListModal(): void {
    this.renameListModalVisible = true;
    setTimeout(() => {
      this.listRenameInput.nativeElement.value = this.lists.find(l => l.uid === this.contextListUid).title;
      this.listRenameInput.nativeElement.focus();
    });
  }
  contextMenu($event: MouseEvent, template: TemplateRef<void>, uid: string): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.contextListUid = uid;
  }
  clickItem(uid: string): void {
    this.router.navigateByUrl('/main/' + uid);
    this.listService.setCurrentUid(uid);
  }
  rename(title: string): void {
    this.listService.rename(this.contextListUid, title);
    this.closeRenameListModal();
  }
  add(title: string): void {
    this.listService.add(title);
    this.closeAddListModal();
  }
  delete(): void {
    const uid = this.contextListUid;
    this.modal.confirm({
      nzTitle: '确认删除列表',
      nzContent: '该操作会导致该列表下的所有待办事项被删除',
      nzOnOk: () => {
        new Promise((res, rej) => {
          this.listService.delete(uid);
          this.todoService.deleteInList(uid);
          res();
          this.message.error('Deleted list failed');
        }).catch(() => this.message.error('Deleted list failed'));
      }
    });
  }
  close(): void {
    this.dropdown.close();
  }
}
