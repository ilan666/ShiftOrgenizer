import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig, MessageConfig } from '../../../appConfig';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/user';
import { AuthService } from '../../services/auth.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  showChangeShiftWindow = false;
  showShiftTable = AppConfig.openShiftRequests;
  success = false;
  successSwitchRequest = false;
  message = MessageConfig;
  currentUser: User;
  selectedShifts: { day: string }[] = [];
  isOpen = false;

  ngOnInit() {
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

  routeToAdmin() {
    this.router.navigate(['/admin']);
  }

  isShiftSelected(day: string): boolean {
    return this.selectedShifts.some((shift) => shift.day === day);
  }

  sendSwitchRequest() {
    this.successSwitchRequest = true;
    this.showChangeShiftWindow = false;

    setTimeout(() => {
      this.successSwitchRequest = false;
    }, 3000);
  }

  sendShifts() {
    // this.currentUser.selectedShifts = this.selectedShifts
    this.userService.updateUserShifts(this.currentUser).subscribe({
      next: (response) => {
        this.success = true;
        setTimeout(() => {
          this.success = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving shifts:', error);
      },
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
