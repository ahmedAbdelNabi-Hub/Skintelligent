import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDaysFromDate'
})
export class WeekDaysFromDatePipe implements PipeTransform {

  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  transform(baseDate: Date): { day: string, date: number }[] {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
    const result: { day: string, date: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      result.push({
        day: this.days[i],
        date: currentDate.getDate()
      });
    }
    return result;
  }
}
