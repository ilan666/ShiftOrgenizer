import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShiftTableComponent } from './shiftTable/shiftTable.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './editUser/editUser.component';
import { AddBroadCastComponent } from './addBroadCast/addBroadCast.component';
import { SwitchShiftsComponent } from './switchShifts/switchShifts.component';
import { SystemSettingsComponent } from './systemSettings/systemSettings.component';
import { AnnouncerWindowComponent } from '../announcer-window/announcer-window.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'shifts', component: ShiftTableComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'edit-user', component: EditUserComponent },
      { path: 'add-broadcast', component: AddBroadCastComponent },
      { path: 'switch-shifts', component: SwitchShiftsComponent },
      { path: 'settings', component: SystemSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    MatIconModule,
    AnnouncerWindowComponent,
  ],
  exports: [RouterModule],
  declarations: [
    AdminComponent,
    ShiftTableComponent,
    AddUserComponent,
    EditUserComponent,
    AddBroadCastComponent,
    SwitchShiftsComponent,
    SystemSettingsComponent,
  ],
})
export class AdminModule {}
