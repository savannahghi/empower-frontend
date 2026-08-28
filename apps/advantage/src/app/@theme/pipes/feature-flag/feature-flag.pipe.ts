import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment';

/**
 * The pipe should get decide whether to show a feature in production or not
 */
@Pipe({
    name: 'featureFlag',
    standalone: true,
})
export class FeatureFlagPipe implements PipeTransform {
    constructor() {}

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    transform(_): boolean {
        return environment.displayFeature === 'true';
    }
}
