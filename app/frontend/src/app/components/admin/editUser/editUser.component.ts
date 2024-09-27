import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../entities/user';
import { timeout } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editUser',
  templateUrl: './editUser.component.html',
  styleUrls: ['./editUser.component.scss'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }), // Start with opacity 0 and moved up 20px
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }) // Fade in to full opacity and original position
        ),
      ]),
    ]),
  ],
})
export class EditUserComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  userExists: boolean = false;
  userDeleted: boolean = false;
  isAdmin: boolean;
  user: User;
  showError = false;
  private errorTimeout: any;
  showUserInfo = false;
  showUserColor = false;

  ngOnInit() {}

  findUser(username: string) {
    this.userService.getUserEdit(username).subscribe({
      next: (userData) => {
        this.user = userData; // Store the user data
        this.userExists = true; // Update the boolean flag
        this.isAdmin = this.user.isAdmin;
        console.log(userData); // Log or handle user data as needed
      },
      error: (err) => {
        console.error('User not found or error occurred', err);
        this.userExists = false; // Update the boolean flag
        this.showError = true;

        if (this.errorTimeout) {
          clearTimeout(this.errorTimeout);
        }

        this.errorTimeout = setTimeout(() => {
          this.showError = false;
        }, 3000);
      },
    });
  }

  makeAsAdmin() {
    this.userService.changeUserAdminState(this.user).subscribe({
      next: (userData) => {
        console.log('Admin state changed now is ' + userData.isAdmin);
        this.user = userData;
        this.isAdmin = this.user.isAdmin;
      },

      error: () => {
        console.log('Some error occured');
      },
    });
  }

  removeUser() {
    this.userService.removeUser(this.user).subscribe({
      next: () => {
        console.log('User removed');
        this.userExists = false;
        this.userDeleted = true;

        setTimeout(() => {
          this.userDeleted = false;
        }, 3000);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
