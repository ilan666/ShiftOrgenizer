import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-announcer-window',
  templateUrl: './announcer-window.component.html',
  styleUrls: ['./announcer-window.component.scss'],
  imports: [MatIconModule, CommonModule],
  standalone: true,
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
export class AnnouncerWindowComponent implements OnInit {
  constructor() {}

  @Input() show = false;
  @Input() icon: string = 'check_circle';
  @Input() message: string = 'Default message';
  icons: string[] = ['check_circle', 'notification_important', 'error'];

  iconStyles: { [key: string]: string } = {
    check_circle: 'green-icon',
    notification_important: 'orange-icon',
    error: 'red-icon',
  };

  ngOnInit() {
    // Optional: Check if the input icon is in the allowed list, otherwise set a default.
    if (!this.icons.includes(this.icon)) {
      console.warn(
        `Icon "${this.icon}" is not recognized. Defaulting to "check_circle".`
      );
      this.icon = 'check_circle';
    }
  }
}
