import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return colour intention based on whether consent has been provided
 */
@Pipe({
    name: 'consentColor',
    standalone: true,
})
export class ConsentColorPipe implements PipeTransform {
    transform(value: any) {
        switch (value) {
            case true:
                return 'success';
            default:
                return 'basic';
        }
    }
}
