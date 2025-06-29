import { animate, style, transition, trigger } from '@angular/animations';

export const emailAnimation = trigger('emailAnimation', [
    // Enter animation: Moves from bottom (off-screen) to top
    transition(':enter', [
        style({opacity: 0 }), // Start from below
        animate('0.3s ease-out', style({ opacity: 1 })) // Move up & fade in
    ]),

    transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0 })) // Move down & fade out
    ])
]);
