import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  errorMessage: string | null = null;
  username = '';
  password = '';

  ngOnInit() {}

  onSubmit() {
    this.userService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('authToken', response.token);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Some error occured';
        }
      },
      error: (error) => {
        this.errorMessage = 'שם משתמש וסיסמה לא נכונים';
        console.error('Request failed', error);
      },
    });
  }
}
