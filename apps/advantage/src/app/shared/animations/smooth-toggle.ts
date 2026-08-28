import {
    state,
    trigger,
    style,
    transition,
    animate,
} from '@angular/animations';

/** Used to for list animations */
export const smoothToggle = trigger('smoothToggle', [
    state(
        'open',
        style({
            opacity: 1,
            maxHeight: '1000px',
            transform: 'translateY(0)',
            marginTop: '*',
            marginBottom: '*',
            paddingTop: '*',
            paddingBottom: '*',
            overflow: 'hidden',
        })
    ),
    state(
        'closed',
        style({
            opacity: 0,
            maxHeight: '0',
            transform: 'translateY(-30px)',
            marginTop: '0',
            marginBottom: '0',
            paddingTop: '0',
            paddingBottom: '0',
            overflow: 'hidden',
        })
    ),
    transition('open <=> closed', [animate('400ms cubic-bezier(0.4,0,0.2,1)')]),
]);
