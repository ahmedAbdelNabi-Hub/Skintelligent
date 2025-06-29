import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export class AsyncDataHandler<T> {
  private dataSubject = new BehaviorSubject<T | undefined>(undefined);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private statusCode = new BehaviorSubject<number | null>(null);

  data$ = this.dataSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  hasError$ = this.errorSubject.asObservable();
  statusCode$ = this.statusCode.asObservable();

  load(action$: Observable<T>): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(false);

    action$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((result: T) => {
          this.dataSubject.next(result);
          return EMPTY;
        }),
        catchError((error: HttpErrorResponse) => {
          this.statusCode.next(error.status);
          this.dataSubject.next(undefined);
          this.errorSubject.next(true);
          console.error('Error occurred while fetching data:', error);
          return EMPTY;
        }),
        finalize(() => {
          this.isLoadingSubject.next(false);
        })
      )
      .subscribe();
  }

  unsubscribe(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
