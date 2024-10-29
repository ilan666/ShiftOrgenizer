import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../entities/user';
import { AppConfig } from '../../../../appConfig';

@Component({
  selector: 'app-user-shift-management',
  templateUrl: './user-shift-management.component.html',
  styleUrls: ['./user-shift-management.component.scss'],
})
export class UserShiftManagementComponent implements OnInit {
  currentUser: User;
  totalSelectedShifts: { day: number; time: string }[] = [];
  currentDisplay = AppConfig.systemTimeTerm;

  constructor(private userService: UserService) {}

  ngOnInit() {}

  sendShifts() {
    // this.currentUser.selectedShifts = this.selectedShifts
  }

  updateShifts(selectedShifts: { day: number; time: string }[]) {
    this.totalSelectedShifts = selectedShifts;
    console.log(this.totalSelectedShifts);
  }
}
