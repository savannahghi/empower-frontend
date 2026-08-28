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
import { FeatureFlagService } from '../../@core/utils/feature.service';

/**
 * Decorator used to define the directive
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[removeIfFeatureOff]',
    standalone: false,
})

/** The directive class */
export class FlagCheckerDirective implements OnChanges {
    @Input() removeIfFeatureOffChecker: string;
    /** Constructor for the class */
    constructor(
        private el: ElementRef,
        public flagService: FeatureFlagService
    ) {
        const nodeValue =
            this.el.nativeElement.attributes.removeIfFeatureOff?.nodeValue;
        if (
            nodeValue !== undefined &&
            this.flagService.featuresLoaded &&
            !this.flagService.getForcedValue(nodeValue)
        ) {
            this.el.nativeElement.style.display = 'none';
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('removeIfFeatureOffChecker' in changes) {
            const flag = changes.removeIfFeatureOffChecker.currentValue;
            if (flag) {
                const hide = this.flagService.getForcedValue(flag);
                if (!hide) {
                    this.el.nativeElement.style.display = 'none';
                }
            }
        }
    }
}
