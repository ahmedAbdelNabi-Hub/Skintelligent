import { animate, style, transition, trigger } from "@angular/animations";

export const toastAnimation = trigger('toastAnimation', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%) scale(0.8)' }), 
        animate('0.2s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })) 
    ]),

    transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0) scale(1)' }),
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateX(100%) scale(0.8)' }))
    ])
]);
