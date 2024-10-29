import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}

  generateCalendar(year: number): Record<string, any[]> {
    const calendar: Record<string, any[]> = {};
    const monthNames = this.getMonthNames();

    monthNames.forEach((monthName, monthIndex) => {
      calendar[monthName] = this.generateWeeksForMonth(year, monthIndex);
    });

    return calendar;
  }

  private getMonthNames(): string[] {
    return [
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
  }

  private generateWeeksForMonth(year: number, month: number): any[] {
    const weeks: any[] = [];
    const daysInMonth = this.getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-6 for Sunday-Saturday

    let currentWeek: { day: string }[] = [];

    // Fill initial null slots (for the first week of the month)
    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push({ day: '' }); // Push an empty day as a placeholder for rendering
    }

    // Fill days of the month into weeks
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({ day: `Day ${day}` });

      // If the week is full or it's the last day of the month, push week and reset
      if (currentWeek.length === 7 || day === daysInMonth) {
        weeks.push(currentWeek);
        currentWeek = []; // Reset for next week
      }
    }

    // Fill any remaining empty slots in the last week
    while (currentWeek.length < 7) {
      currentWeek.push({ day: '' }); // Fill with placeholders for the remaining days
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
}
