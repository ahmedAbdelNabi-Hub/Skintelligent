import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? 'minute' : 'minutes'
      } ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'Yesterday';
    }

    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    // Less than a month
    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }

    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    // More than a year
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }
}
