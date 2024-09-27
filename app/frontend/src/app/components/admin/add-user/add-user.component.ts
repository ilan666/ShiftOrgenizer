import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../../entities/user';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
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
export class AddUserComponent {
  constructor(private userService: UserService) {}

  success = false;

  createNewUser(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const formValues = form.value;
    const newUser = new User();
    newUser.firstname = formValues.firstname;
    newUser.lastname = formValues.lastname;
    newUser.username = formValues.name;
    newUser.phone = formValues.phone;
    newUser.password = formValues.password;
    newUser.selectedShifts = ['shift1', 'shift2'];
    newUser.currentShifts = ['shift1', 'shift2'];

    this.userService.createUser(newUser).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        form.reset();
        this.success = true;

        setTimeout(() => {
          this.success = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error creating user:', error);
      },
    });
  }
}
