import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MessageConfig } from '../../../../appConfig';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addBroadCast',
  templateUrl: './addBroadCast.component.html',
  styleUrls: ['./addBroadCast.component.scss'],
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
export class AddBroadCastComponent implements OnInit {
  constructor(private router: Router) {}

  success = false;
  message = MessageConfig;

  form = {
    title: this.message.header,
    body: this.message.message,
  };

  ngOnInit() {}

  postBroadcast(form: any) {
    if (this.form.title.length != 0 && this.form.title.length != 0) {
      MessageConfig.header = this.form.title;
      MessageConfig.message = this.form.body;
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 3000);
    } else {
      // Make a message login if no header is inserted for feedback
    }
  }

  routeToHome() {
    this.router.navigate(['/home']);
  }

  resetForm(form: any) {
    form.reset();
  }
}
