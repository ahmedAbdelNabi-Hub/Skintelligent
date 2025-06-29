import { trigger, transition, style, animate } from '@angular/animations';

export const routingAnimation = trigger('routingAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }), // Start fully transparent
    animate('500ms', style({ opacity: 1 })), // Animate to fully opaque
  ]),
]);
