import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment';

/**
 * The pipe should decide whether to hide a feature/component in a particular variant
 */
@Pipe({
    name: 'variant',
    standalone: true,
})
export class VariantPipe implements PipeTransform {
    constructor() {}
    transform(variant: any) {
        if (typeof variant === 'boolean') {
            return variant;
        }

        if (!variant || variant === '' || variant === null) {
            return false;
        }

        const AND = ':';
        const OR = ';';
        const envVariant = environment.variant;
        let opposite = false;
        let useOr = false;
        let listVariants = [];
        let varyant = variant;

        // Convert to string if not already a string
        if (typeof varyant !== 'string') {
            varyant = String(varyant);
        }

        if (varyant[0] === '!') {
            // This means that none of the variants should be displayed
            opposite = true;
            varyant = variant.slice(0, 0) + variant.slice(1);
        }

        if (varyant.indexOf(AND) !== -1 && varyant.indexOf(OR) !== -1) {
            throw Error('You can only use one type of action splitter');
        }

        /** No AND or OR in the string, just a normal string */
        if (varyant.indexOf(AND) === -1 && varyant.indexOf(OR) === -1) {
            listVariants = [varyant];
            useOr = true;
        }

        /**
         * Check if the splitter is using OR for splitting
         */
        if (varyant.indexOf(OR) !== -1) {
            listVariants = varyant.split(OR);
            useOr = true;
        }

        for (let i = 0; i < listVariants.length; i++) {
            const vars = listVariants;
            let res = true;

            /**
             * Check permission exists in user's permissions
             */
            if (!vars.includes(envVariant) && !opposite) {
                res = false;
            }

            if (vars.includes(envVariant) && opposite) {
                res = false;
            }

            /**
             * This is an OR check. Where if any checker passes a user is
             * allowed access
             **/
            if (res && useOr) {
                return true;
            }
        }

        return useOr ? false : true;
    }
}
