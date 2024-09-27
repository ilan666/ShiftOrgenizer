import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../entities/user';
import { UserService } from '../../services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
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
export class AdminComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  currentUser: User;

  ngOnInit() {
    this.getUser();
  }

  returnHome() {
    this.router.navigate(['/home']);
  }

  getUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user; // Store the user data in the currentUser variable
        console.log('User data retrieved:', user); // Optional: log the user data
      },
      error: (err) => {
        console.error('Error fetching user data:', err); // Handle errors
      },
    });
  }

  isAdminOnly() {
    return this.router.url === '/admin';
  }
}
