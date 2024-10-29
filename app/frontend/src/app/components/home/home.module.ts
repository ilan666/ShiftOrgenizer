import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { AnnouncerWindowComponent } from '../announcer-window/announcer-window.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { UserShiftManagementComponent } from './user-shift-management/user-shift-management.component';
import { UserShiftDisplayComponent } from './user-shift-display/user-shift-display.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    NzSelectModule,
    NzFormModule,
    FormsModule,
    AnnouncerWindowComponent,
  ],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    CalendarComponent,
    UserShiftManagementComponent,
    UserShiftDisplayComponent,
  ],
})
export class HomeModule {}
