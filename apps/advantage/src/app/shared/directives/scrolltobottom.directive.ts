import { Directive, ElementRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[scrollToBottom]',
    standalone: false,
})
export class ScrollToBottomDirective {
    constructor(private _el: ElementRef) {}

    public scrollToBottom() {
        const el: HTMLDivElement = this._el.nativeElement;
        el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
    }
}
