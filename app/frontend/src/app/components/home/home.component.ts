import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  selectedShifts: { day: string; time: string }[] = [];
  showChangeShiftWindow = false;

  ngOnInit() {}

  appointShift(event: MouseEvent, day: string, time: string): void {
    const target = event.target as HTMLElement;

    const shiftIndex = this.selectedShifts.findIndex(
      (shift) => shift.day === day && shift.time === time
    );

    if (shiftIndex !== -1) {
      // If the shift already exists, remove it from the array and reset color
      this.selectedShifts.splice(shiftIndex, 1);
      target.style.backgroundColor = '#f4f4f4';
    } else {
      // If the shift doesn't exist, add it to the array and change color
      this.selectedShifts.push({ day, time });
      target.style.backgroundColor = 'rgba(0, 210, 0, 0.6)';
    }

    console.log(this.selectedShifts);
  }
}
