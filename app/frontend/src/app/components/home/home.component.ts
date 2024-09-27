import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig, MessageConfig } from '../../../appConfig';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/user';
import { AuthService } from '../../services/auth.service';

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

  selectedShifts: { day: string }[] = [];
  showChangeShiftWindow = false;
  scheduleOptions = ['שבועי', 'חודשי'];
  selectedScheduleOption: string | null = null;
  showShiftTable = AppConfig.openShiftRequests;
  success = false;
  successSwitchRequest = false;
  message = MessageConfig;
  currentUser: User;

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

  appointShift(event: MouseEvent, day: string): void {
    const target = event.target as HTMLElement;

    const shiftIndex = this.selectedShifts.findIndex(
      (shift) => shift.day === day
    );

    if (shiftIndex !== -1) {
      // If the shift already exists, remove it from the array
      this.selectedShifts.splice(shiftIndex, 1);
    } else {
      // If the shift doesn't exist, add it to the array
      this.selectedShifts.push({ day });
    }

    console.log(this.selectedShifts);
  }

  selectOption(option: string) {
    this.selectedScheduleOption = option;
  }

  routeToAdmin() {
    this.router.navigate(['/admin']);
  }

  isShiftSelected(day: string): boolean {
    return this.selectedShifts.some((shift) => shift.day === day);
  }

  sendShifts() {
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 3000);
  }

  sendSwitchRequest() {
    this.successSwitchRequest = true;
    this.showChangeShiftWindow = false;

    setTimeout(() => {
      this.successSwitchRequest = false;
    }, 3000);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
