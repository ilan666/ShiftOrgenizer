import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-switchShifts',
  templateUrl: './switchShifts.component.html',
  styleUrls: ['./switchShifts.component.scss'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }), // Start with opacity 0 and moved up 20px
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }) // Fade in to full opacity and original position
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' }) // Fade out and move up 20px
        ),
      ]),
    ]),
  ],
})
export class SwitchShiftsComponent implements OnInit {
  constructor() {}

  success = false;

  ngOnInit() {}

  approveSwitch() {
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 3000);
  }
}
