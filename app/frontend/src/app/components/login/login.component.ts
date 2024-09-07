import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onSubmit(form: any) {
    // Here you could add form validation logic if needed
    console.log('Form submitted:', form);
    this.router.navigate(['/home']);
  }
}
