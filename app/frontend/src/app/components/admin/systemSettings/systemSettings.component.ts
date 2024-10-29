import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../../appConfig';

@Component({
  selector: 'app-systemSettings',
  templateUrl: './systemSettings.component.html',
  styleUrls: ['./systemSettings.component.scss'],
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
export class SystemSettingsComponent implements OnInit {
  constructor() {}

  showChangeTimeSettings = false;
  timeSetting = AppConfig.systemTimeTerm;
  monthly = AppConfig.systemTimeTermOptions.Monthly;
  weekly = AppConfig.systemTimeTermOptions.Weekly;
  success = false;

  ngOnInit() {}

  setSystemTimeSetting() {
    if (this.timeSetting === AppConfig.systemTimeTermOptions.Monthly) {
      AppConfig.systemTimeTerm = AppConfig.systemTimeTermOptions.Monthly;
    } else if (this.timeSetting === AppConfig.systemTimeTermOptions.Weekly) {
      AppConfig.systemTimeTerm = AppConfig.systemTimeTermOptions.Weekly;
    }

    this.showChangeTimeSettings = false;
    this.success = true;

    setTimeout(() => {
      this.success = false;
    }, 3000);
  }

  selectWeeklyOption() {
    this.timeSetting = AppConfig.systemTimeTermOptions.Weekly;
  }

  selectMonthlyOption() {
    this.timeSetting = AppConfig.systemTimeTermOptions.Monthly;
  }
}
