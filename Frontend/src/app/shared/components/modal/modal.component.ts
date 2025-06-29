import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { modalAnimations } from '../../../core/animations/modalAnimations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule],
  animations: [modalAnimations.fadeInOut, modalAnimations.slideUpDown],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  close() {
    this.closeModal.emit();
  }
}
