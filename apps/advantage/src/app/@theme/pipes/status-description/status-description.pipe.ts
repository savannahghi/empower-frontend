import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to split strings e.g. '_' with ' '
 */
@Pipe({
    name: 'statusDescription',
    standalone: false,
})
export class StatusDescriptionPipe implements PipeTransform {
    transform(value: string, model: string): any {
        if (model === 'serviceRequest') {
            switch (value) {
                case 'PENDING':
                    return 'The patient has not been added into this queue yet';
                case 'WAITING':
                    return 'The is in the queue waiting to be seen';
                case 'IN_PROGRESS':
                    return 'The patient is currently being offered a service';
                case 'COMPLETED':
                    return 'The patient has received service from this point';
                case 'ENTERED_IN_ERROR':
                    return 'The patient was added to the queue by mistake';
                default:
                    return '';
            }
        }
        if (model === 'visit') {
            switch (value) {
                case 'ARRIVED':
                    return 'The patient is within the facility and is ready to receive a service';
                case 'IN_PROGRESS':
                    return 'The patient has committed funds for a service or more within this visit';
                case 'CANCELLED':
                    return `The patient's visit was cancelled`;
                case 'FINISHED':
                    return 'The patient was done with this visit';
                default:
                    return '';
            }
        }
        if (model === 'billing') {
            switch (value) {
                case 'CASH':
                    return 'The patient has to pay upfront for services';
                default:
                    return 'The patient may receive services before paying for them';
            }
        }
    }
}
