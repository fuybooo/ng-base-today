import {animate, state, style, transition, trigger} from '@angular/animations';

export const titleToggle = trigger('titleToggle', [
  state('open', style({
    height: 'auto',
    top: '40px',
    opacity: 1
  })),
  state('close', style({
    height: 0,
    top: '-40px',
    opacity: 0
  })),
  transition('open => close', [animate('500ms ease-out')]),
  transition('* => open', [animate('300ms ease-in')]),
]);

export const faceToggle = trigger('faceToggle', [
  state('open', style({
    top: '-270px',
    opacity: 1,
  })),
  state('close', style({
    top: '-220px',
    opacity: 0,
    display: 'none'
  })),
  transition('open => close', [animate('200ms ease-out')]),
  transition('* => open', [animate('300ms ease-in')]),
]);
