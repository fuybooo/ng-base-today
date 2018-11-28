import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../core/local-storage/local-storage.service';
import {environment} from '../../../environments/environment';
import {MSG_TYPE} from './wechat.model';

const staticFilePath = '/assets/images/wechat/chats/';

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.component.html',
  styleUrls: ['./wechat.component.less']
})
export class WechatComponent implements OnInit {
  crtUser;
  chatList;
  crtChat;
  MSG_TYPE = MSG_TYPE;
  constructor(
    private store: LocalStorageService
  ) { }

  ngOnInit() {
    this.init();
  }
  init() {
    this.crtUser = {
      avatar: this.getMockAvatar(),
      nickname: '不知不觉',
    };
    this.chatList = [
      {
        avatar: this.getMockAvatar(3, true),
        nickname: '攻城狮们',
        msg: '张春晓:来，强哥，这里有你的两个bug，请过来领取。',
        time: '18:00',
        msgCount: 20,
        memberCount: 17,
        isGroup: true,
        isMuted: false
      },
      {
        avatar: this.getMockAvatar(4, true),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '16:05',
        msgCount: 20,
        isGroup: true,
        isMuted: true,
        isActivated: true,
        showNickname: false,
        contentList: [
          {
            time: '16:05',
            avatar: this.getMockAvatar(4),
            nickname: '安卓之子',
            message: '逍遥世间，永恒自在',
            messageType: MSG_TYPE.TEXT
          },
          {
            avatar: this.getMockAvatar(),
            nickname: '不知不觉',
            message: '堪比至仙',
            messageType: MSG_TYPE.TEXT,
            isMe: true
          }
        ]
      },
      {
        avatar: this.getMockAvatar(5, true),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
        isMuted: true,
      },
      {
        avatar: this.getMockAvatar(6, true),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
        isMuted: true,
      },
      {
        avatar: this.getMockAvatar(6),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(7),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(3),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(4),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(2),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(8),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(9),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(10),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(11),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(12),
        nickname: '产品讨论组',
        msg: '傅勇波:白白',
        time: '18:05',
      },
      {
        avatar: this.getMockAvatar(13),
        nickname: '产品讨论组',
        msg: '傅勇波:最后一个',
        time: '18:05',
      },
    ];
    this.crtChat = this.chatList.find(item => item.isActivated);
  }
  getMockAvatar(i: any = null, isGroup = false) {
    return `${environment.deployPath}${staticFilePath}${isGroup ? 'webwxgetheadimg' : 'webwxgeticon'}${i ? ` (${i})` : ''}.jpg`;
  }
}
