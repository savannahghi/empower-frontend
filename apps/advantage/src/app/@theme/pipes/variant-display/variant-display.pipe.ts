import { Pipe, PipeTransform } from '@angular/core';

/**
 * The pipe should get decide whether to show a feature in production or not
 */
@Pipe({
    name: 'variantDisplay',
    standalone: true,
})
export class VariantDisplayPipe implements PipeTransform {
    constructor() {}
    transform(value: any) {
        switch (value) {
            case 'default':
                return 'Slade360 Advantage';
            case 'empower':
                return 'Empower Clinic';
            default:
                return 'Slade360 Advantage';
        }
    }
}
