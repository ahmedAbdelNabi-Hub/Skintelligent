import { Component, ElementRef, Renderer2, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { toastAnimation } from '../../../core/animations/toastAnimations';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  animations: [toastAnimation], 
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  private destroy$ = new Subject<void>();
  messageQueue = signal<{ message: string; type: string }[]>([]);
  hidden: boolean = false;

  constructor(
    private toastService: ToastService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.toastService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ message, type }) => {
        const currentQueue = this.messageQueue();
        this.messageQueue.set([...currentQueue, { message, type }]);
        if (currentQueue.length === 0) {
          this.hidden = true;
          this.showNextMessage();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showNextMessage(): void {
    if (this.messageQueue().length === 0) {
      this.hidden = false;
      return;
    }

    setTimeout(() => {
      const updatedQueue = [...this.messageQueue()];
      updatedQueue.shift();
      this.messageQueue.set(updatedQueue);
      this.showNextMessage();
    }, 3000);
  }
}
