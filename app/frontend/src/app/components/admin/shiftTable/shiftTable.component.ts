import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../../appConfig';

@Component({
  selector: 'app-shiftTable',
  templateUrl: './shiftTable.component.html',
  styleUrls: ['./shiftTable.component.scss'],
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
export class ShiftTableComponent implements OnInit {
  constructor() {}

  shiftsOpen: boolean = false;
  shiftsClosed: boolean = false;
  isShiftsOpen: boolean = false;

  ngOnInit() {
    this.isShiftsOpen = AppConfig.openShiftRequests;
  }

  openShifts() {
    AppConfig.openShiftRequests = !AppConfig.openShiftRequests;
    this.isShiftsOpen = !this.isShiftsOpen;

    if (this.isShiftsOpen) {
      this.shiftsOpen = true;
      setTimeout(() => {
        this.shiftsOpen = false;
      }, 3000);
    } else {
      this.shiftsClosed = true;
      setTimeout(() => {
        this.shiftsClosed = false;
      }, 3000);
    }
  }
}
