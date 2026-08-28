import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';

/** Used to for list animations */
export const listAnimation = trigger('listAnimation', [
    transition('* => *', [
        // each time the binding value changes
        query(
            ':enter',
            [
                style({ opacity: 0 }),
                stagger(200, [animate('0.5s', style({ opacity: 1 }))]),
            ],
            { optional: true }
        ),
    ]),
]);
