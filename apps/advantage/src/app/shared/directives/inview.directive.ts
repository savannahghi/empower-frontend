import {
    Directive,
    ElementRef,
    OnDestroy,
    Output,
    EventEmitter,
} from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[componentInView]',
    standalone: false,
})
export class InviewDirective implements OnDestroy {
    // directive checks if the zero state component is in view
    @Output() inView: EventEmitter<any> = new EventEmitter<any>();
    private observer: IntersectionObserver;

    constructor(private el: ElementRef) {
        /**
         *  intersection observer monitors the visibility of the zero state div
         *  if it's visible it emits event(true), the event will be used to
         *  toggle other components' visibility
         */
        this.observer = new IntersectionObserver(
            ([entry]) => {
                this.inView.emit(entry.isIntersecting);
            },
            { threshold: [0.1] }
        );
        this.observer.observe(this.el.nativeElement);
    }

    /** clean up memory leaks */
    ngOnDestroy() {
        this.observer.disconnect();
    }
}
