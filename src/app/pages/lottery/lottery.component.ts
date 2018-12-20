import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../core/local-storage/local-storage.service';
import {LOTTERY_PARTICIPANT, LOTTERY_PRIZE, LOTTERY_WINNER} from '../../core/local-storage/local-storage.namespace';
import {sortObjectList} from '../../../fns/fns-util';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less']
})
export class LotteryComponent implements OnInit {
  timer;
  crtWinner;
  list = [];
  crtPrize;
  nextPrize;
  prizeList = [];
  winnerList = [];
  constructor(
    private router: Router,
    private store: LocalStorageService
  ) { }

  ngOnInit() {
    this.init();
  }
  init() {
    this.winnerList = [];
    this.list = this.store.get(LOTTERY_PARTICIPANT);
    // 生成prizeList
    const prizes = this.store.get(LOTTERY_PRIZE);
    this.prizeList = [];
    prizes.map(item => Array(item.num).fill(item)).forEach(item => {
      this.prizeList = [...this.prizeList, ...item];
    });
    this.prizeList = sortObjectList(this.prizeList, 'sort');
    this.crtPrize = this.prizeList.pop();
    this.nextPrize = this.prizeList.slice(-1)[0];
  }
  start() {
    const getNewWinner = () => this.list[Math.floor(Math.random() * this.list.length)];
    this.timer = setInterval(() => {
      let newWinner = getNewWinner();
      while (newWinner === this.crtWinner) {
        newWinner = getNewWinner();
      }
      this.crtWinner = newWinner;
    }, 200);
  }
  stop() {
    setTimeout(() => {
      clearInterval(this.timer);
      this.winnerList = [{
        winner: this.crtWinner,
        prize: this.crtPrize.prize
      }, ...this.winnerList];
      if (this.prizeList.length) {
        this.crtPrize = this.prizeList.pop();
      } else {
        this.crtPrize = null;
      }
      if (this.prizeList.length) {
        this.nextPrize = this.prizeList.slice(-1)[0];
      } else {
        this.nextPrize = null;
      }
    }, 200);
  }
  reset() {
    this.init();
  }
  toSetting() {
    this.store.set(LOTTERY_WINNER, this.winnerList.map(item => ({
      ...item,
      name: item.winner.name
    })));
    this.router.navigateByUrl('/lottery/setting');
  }
}
