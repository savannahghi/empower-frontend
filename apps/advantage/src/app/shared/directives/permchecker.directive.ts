/**
 * Imports used in the directive
 */
import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { AuthenticationService } from '../../@core/auth/services/authentication.service';

/**
 * Decorator used to define the directive
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[silpermchecker]',
    standalone: false,
})

/** The directive class */
export class PermcheckerDirective implements OnChanges {
    @Input() silpermchecker: string;
    /** Constructor for the class */
    constructor(private el: ElementRef, public auth: AuthenticationService) {
        const nodeValue =
            this.el.nativeElement.attributes.silpermchecker?.nodeValue;
        if (nodeValue !== undefined) {
            const hide = auth.checkPermission(nodeValue);
            if (!hide) {
                this.el.nativeElement.style.display = 'none';
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('silpermchecker' in changes) {
            const newChecker = changes.silpermchecker.currentValue;
            if (newChecker) {
                const hide = this.auth.checkPermission(newChecker);
                if (!hide) {
                    this.el.nativeElement.style.display = 'none';
                }
            }
        }
    }
}
