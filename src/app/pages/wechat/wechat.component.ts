import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from '../../core/local-storage/local-storage.service';
import {environment} from '../../../environments/environment';
import {MSG_TYPE, faceList, emojiList} from './wechat.model';
import {chatList, concatList, readList} from './wechat-mock';
import {guid, sortObjectList} from '../../../fns/fns-util';
import {titleToggle, faceToggle} from './webchat.animation';

const staticFilePath = '/assets/images/wechat/';
declare let pinyinUtil: any;
declare let $: any;

const scrollToBottom = function (scroll) {
  $(scroll).mCustomScrollbar('scrollTo', 'bottom');
};

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.component.html',
  animations: [titleToggle, faceToggle],
  styleUrls: ['./wechat.component.less']
})
export class WechatComponent implements OnInit {
  crtUser;
  chatList: any[];
  crtChat;
  MSG_TYPE = MSG_TYPE;
  crtTabType = 1;
  readList: any[];
  concatList: any[];
  keyword = '';
  resultList = [];
  isPushOn = true;
  isVolumeOn = true;
  scrollOptions = {
    scrollTo: 'bottom',
    scrollInertia: 1,
    callbacks: {
      onOverflowY: function() {
        // 切换时执行
        scrollToBottom(this);
      }
    }
  };
  isOpen = false; // 控制title动画
  faceOpen = false; // 控制表情动画
  faceType = 1;
  faceList = faceList;
  emojiList = emojiList;
  crtContent;
  @ViewChild('contentInput') contentInput: ElementRef;
  constructor(
    private store: LocalStorageService
  ) { }

  ngOnInit() {
    this.init();
    this.bind();
  }

  init() {
    this.crtUser = {
      avatar: this.getMockAvatar(),
      nickname: '不知不觉',
    };
    this.chatList = chatList.map((item: any) => ({
        ...this.getCommonProperty({
          ...item,
          uid: guid(),
        }),
        contentList: (item.contentList ? (item.contentList.map(cont => this.getCommonProperty(cont))) : []),
        memberList: (item.memberList ? (item.memberList.map(member => this.getCommonProperty(member))) : [])
      })
    );
    this.crtChat = this.chatList.find(item => item.isActivated);
    this.readList = readList.map(item => ({...this.getCommonProperty(item, 'title'), uid: guid()}));
    this.concatList = this.getGroupedConcatList(concatList.map(item => ({...item, uid: guid()})));
  }
  getGroupedConcatList(_concatList) {
    let _temp;
    const tempConcatList = _concatList.map(item => this.getCommonProperty(item));
    // 对tempConcatList进行分组排序
    _temp = [
      {
        title: '群组'
      },
      ...sortObjectList(tempConcatList.filter(item => item.concatFlag === 2), 'py1')
    ];
    // 对联系人进行分组排序
    const concatSet = new Set();
    const concatMap = new Map();
    const otherList = [];
    for (let i = 0, l = tempConcatList.length; i < l; i ++) {
      const item = tempConcatList[i];
      if (item.concatFlag === 1) {
        if (/^[a-z]$/i.test(item.py1[0])) {
          concatSet.add(item.py1[0].toUpperCase());
        } else {
          otherList.push(item);
        }
      }
    }
    Array.from(concatSet).sort().forEach(con => {
      let list = [];
      for (let i = 0, l = tempConcatList.length; i < l; i ++) {
        const item = tempConcatList[i];
        const py1 = item.py1[0].toUpperCase();
        if (py1 === con) {
          list = [...list, item];
        }
      }
      concatMap.set(con, list);
    });
    let concatArray = [];
    concatMap.forEach((value, key) => {
      concatArray = [...concatArray, {title: key}, ...value];
    });
    _temp = [..._temp, ...concatArray, ...(otherList.length ? [{title: '~'}, ...otherList] : [])];
    return _temp;
  }
  bind() {
    $(document.body).off('click.wechat').on('click.wechat', (e) => {
      // 搜索框下拉 判断e.target是否被.search-result 包含
      if ($('.search-result')[0]) {
        if (!($('.search-result')[0] === e.target || $.contains($('.search-result')[0], e.target))) {
          this.keyword = '';
        }
      }
      // 标题下拉
      // 点击的元素在触发显隐区域，或者显示图片区域，则什么也不做，否则
      if ($('.member-box')[0]) {
        if (!($('.member-box')[0] === e.target ||
          $.contains($('.member-box')[0], e.target) ||
          $('.title-wrapper')[0] === e.target ||
          $.contains($('.title-wrapper')[0], e.target)
        )) {
          this.isOpen = false;
        }
      }
      // 表情下拉框
      if ($('.face-panel')[0] && $('.face-panel').is(':visible')) {
        if (!($('.face-panel')[0] === e.target ||
          $.contains($('.face-panel')[0], e.target) ||
          $('.toolbar .face')[0] === e.target ||
          $.contains($('.toolbar .face')[0], e.target)
        )) {
          this.faceOpen = false;
        }
      }
    });
  }
  getMockAvatar(i: any = null, type: string = null) {
    const imgPath = `${environment.deployPath}${staticFilePath}`;
    if (type) {
      switch (type) {
        case 'group':
          return `${imgPath}chats/webwxgetheadimg${i ? ` (${i})` : ''}.jpg`;
        case 'read':
          return `${imgPath}read/webwxgeticon-read${i ? ` (${i})` : ''}.jpg`;
      }
    } else {
      return `${imgPath}chats/webwxgeticon${i ? ` (${i})` : ''}.jpg`;
    }
  }
  getCommonProperty(item, field = 'nickname') {
    return {
      ...item,
      avatar: this.getMockAvatar(item._avatar_i, item._avatar_type),
      py: pinyinUtil.getPinyin(item[field]),
      py1: pinyinUtil.getFirstLetter(item[field]),
    };
  }
  changeTab(type) {
    this.crtTabType = type;
  }
  search() {
    this.keyword = this.keyword.trim();
    if (this.keyword) {
      if (this.crtTabType === 1) {
        const tempResult = this.chatList.filter(item => item.nickname.includes(this.keyword) || item.py.includes(this.keyword)).map(item => ({...item, content: item.nickname}));
        // 分组
        const tempGroup = tempResult.filter(item => item.isGroup);
        const tempFriend = tempResult.filter(item => !item.isGroup);
        this.resultList = [
          ...(tempGroup.length ? [
            {
              title: '群组',
            },
              ...tempGroup,
            ] : []),
          ...(tempFriend.length ? [
            {
              title: '好友',
            },
            ...tempFriend,
          ] : []),
        ];
      } else if (this.crtTabType === 2) {
        this.resultList = this.readList.filter(item => (item.title && (item.title.includes(this.keyword) || item.py.includes(this.keyword))));
      } else if (this.crtTabType === 3) {
        // this.resultList = this.getGroupedConcatList(concatList.map(item => ({...this.getCommonProperty(item), title: item.nickname})).filter(item => {
        //   return item.nickname.includes(this.keyword) || item.py.includes(this.keyword);
        // }));
        this.resultList = concatList.map(item => ({...this.getCommonProperty(item), content: item.nickname})).filter(item => {
          return item.nickname.includes(this.keyword) || item.py.includes(this.keyword);
        });
      }
    }
  }
  changePermission(type) {
    if (type === 'push') {
      this.isPushOn = !this.isPushOn;
    }
    if (type === 'volume') {
      this.isVolumeOn = !this.isVolumeOn;
    }
  }
  changeActive(chat) {
    this.crtChat = chat;
    // 改变未读数
    this.crtChat.msgCount = 0;
    // 改变激活状态
    this.chatList.forEach(item => item.isActivated = chat.uid === item.uid);
  }
  toggleMemberBox() {
    if (this.crtChat.memberList && this.crtChat.memberList.length) {
      this.isOpen = !this.isOpen;
    }
  }
  toggleFace() {
    this.faceOpen = !this.faceOpen;
  }
  selectFace() {

  }
  screenshots() {}
  selectFile(file) {
    if (file) {
      // 发送文件
    }
  }
  keyCrtContent($event) {
    this.crtContent = $event.target.innerHTML;
    if ($event.keyCode === 13) {
      $event.preventDefault();
      this.sendMsg();
    }
  }
  sendMsg() {
    this.crtChat.contentList = [...(this.crtChat.contentList || []), {
      nickname: this.crtUser.nickname,
      message: this.crtContent,
      messageType: MSG_TYPE.TEXT,
      isMe: true,
      avatar: this.getMockAvatar()
    }];
    // 发送完成之后将输入框清空
    this.contentInput.nativeElement.innerHTML = '';
    this.crtContent = '';
  }
}
