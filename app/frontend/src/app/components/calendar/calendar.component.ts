import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { AppConfig } from '../../../appConfig';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  @Input() role: string = 'ShiftAssign';
  @Output() selectedShiftsChange = new EventEmitter<
    { day: number; time: string }[]
  >();

  currentDate!: number;
  currentMonth!: number;
  nextMonth!: number;
  currentYear!: number;
  calendar!: Year;
  weeks: number[][] = [];
  selectedShifts: { day: number; time: string }[] = [];
  roles: string[] = ['ShiftAssign', 'Admin', 'Display'];
  display: string = 'Monthly';

  ngOnInit() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.nextMonth = this.currentMonth + 1;
    this.calendar = this.generateCalendar(this.currentYear);

    if (AppConfig.systemTimeTerm == AppConfig.systemTimeTermOptions.Monthly)
      this.display = 'Monthly';
    if (AppConfig.systemTimeTerm == AppConfig.systemTimeTermOptions.Weekly)
      this.display = 'Weekly';

    console.log(this.calendar);
    console.log('Current Month:', this.calendar.months[this.currentMonth]);
    console.log('Next Month:', this.calendar.months[this.nextMonth]);
  }

  generateCalendar(year: number): Year {
    const months: Month[] = [];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const weeks: Week[] = [];
      const firstDayOfMonth = new Date(year, monthIndex, 1);
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();

      let currentDayIndex = 1;
      let startDayOfWeek = firstDayOfMonth.getDay();

      for (let i = 0; i < 6; i++) {
        const days: Day[] = new Array(7).fill(null).map(() => ({ date: null }));

        for (let j = 0; j < 7; j++) {
          if (
            (i === 0 && j < startDayOfWeek) ||
            currentDayIndex > daysInMonth
          ) {
            continue;
          }

          days[j] = { date: new Date(year, monthIndex, currentDayIndex) };
          currentDayIndex++;
        }

        weeks.push({ days });
      }

      months.push({ name: monthNames[monthIndex], weeks });
    }

    return { year, months };
  }

  addShift(event: MouseEvent, day: number, time: string): void {
    const target = event.target as HTMLElement;

    const shiftIndex = this.selectedShifts.findIndex(
      (shift) => shift.day === day && shift.time === time
    );

    if (shiftIndex !== -1) {
      // If the shift already exists, remove it from the array
      this.removeShift(shiftIndex);
      this.renderer.removeClass(target, 'active');
    } else {
      // If the shift doesn't exist, add it to the array
      this.selectedShifts.push({ day, time });
      this.renderer.addClass(target, 'active');
    }

    this.selectedShiftsChange.emit(this.selectedShifts);
  }

  private removeShift(index: number) {
    this.selectedShifts.splice(index, 1);
  }

  getWeeklyView(currentYear: number, currentMonth: number): Day[] {
    const today = new Date();
    const currentWeekDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentWeekDay); // Start of the current week

    const weekDays: Day[] = Array(7)
      .fill(null)
      .map((_, i) => {
        const nextDay = new Date(startOfWeek);
        nextDay.setDate(startOfWeek.getDate() + i);

        if (
          nextDay.getFullYear() === currentYear &&
          nextDay.getMonth() === currentMonth
        ) {
          return { date: nextDay };
        }

        return { date: null }; // Day not in the current month/year
      });

    return weekDays;
  }
}

interface Day {
  date: Date | null;
}

interface Week {
  days: Day[];
}

interface Month {
  name: string;
  weeks: Week[];
}

interface Year {
  year: number;
  months: Month[];
}
