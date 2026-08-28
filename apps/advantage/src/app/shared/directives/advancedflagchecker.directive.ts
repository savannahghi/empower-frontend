/**
 * Imports used in the directive
 */
import { Directive, ElementRef, Input } from '@angular/core';
import { VariantPipe } from '../../@theme/pipes/variant/variant.pipe';
import { FeatureFlagService } from '../../@core/utils/feature.service';

/**
 * Decorator used to define the directive
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[variantflag]',
    standalone: false,
})

/**
 * Directive to control element visibility based on feature flags
 *
 * Key functionality:
 * - Evaluates feature flags to show/hide elements
 * - For flags with rules, uses GrowthBook's evaluation engine to handle:
 *   - Complex conditional logic ($or, $and operators)
 *   - User attribute matching (email, variant, custom attributes)
 *   - Rule priority (first matching rule wins)
 * - Falls back to defaultValue if GrowthBook can't evaluate the feature
 * - Integrates with variantPipe for variant-specific visibility
 */
export class VariantFlagCheckerDirective {
    @Input('variantflag') variantflag: string;
    /** Constructor for the class */
    constructor(
        private el: ElementRef,
        public variantPipe: VariantPipe,
        public flagService: FeatureFlagService
    ) {
        // Evaluates the flag on fetch from flagging server
        this.flagService.flagsLoadedEmitter.subscribe(flagServ => {
            this.flagService = flagServ;
            this.evaluateFlag();
        });
        // Evaluates the flag on initialization
        this.evaluateFlag();
    }

    evaluateFlag() {
        this.el.nativeElement.style.setProperty('display', 'none');
        const nodeValue =
            this.el.nativeElement.attributes.variantflag?.nodeValue;
        if (
            (nodeValue || this.variantflag) &&
            this.flagService.featuresLoaded
        ) {
            const value = nodeValue || this.variantflag;
            const feature = this.flagService.featureFlags[value];

            // If feature doesn't exist, show element (backward compatibility)
            if (!feature) {
                this.el.nativeElement.style.setProperty(
                    'display',
                    'flex',
                    'important'
                );
                return;
            }

            let featureValue = feature.defaultValue;

            // If rules exist, use GrowthBook's evaluation engine to properly handle:
            // - Complex conditions ($or, $and, nested logic)
            // - User attribute matching (email, variant, custom attributes)
            // - Rule priority (first matching rule wins)
            // This ensures feature flags with conditional rules work correctly
            if (feature.rules && feature.rules.length > 0) {
                // Ensure features are set on GrowthBook instance before evaluation
                this.flagService.growthbook.setFeatures(
                    this.flagService.featureFlags
                );

                const result = this.flagService.growthbook.evalFeature(value);
                // Only use GrowthBook result if it successfully found and evaluated the feature
                // If GrowthBook returns 'unknownFeature', fall back to defaultValue
                if (result.source !== 'unknownFeature') {
                    featureValue = result.value;
                }
            }

            const shouldHide =
                featureValue !== undefined &&
                !this.variantPipe.transform(featureValue);

            if (shouldHide) {
                this.el.nativeElement.style.setProperty(
                    'display',
                    'none',
                    'important'
                );
                this.el.nativeElement.remove();
            } else {
                this.el.nativeElement.style.setProperty(
                    'display',
                    'flex',
                    'important'
                );
            }
        } else {
            this.el.nativeElement.style.setProperty(
                'display',
                'flex',
                'important'
            );
        }
    }
}
