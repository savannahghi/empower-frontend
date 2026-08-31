import { Pipe, PipeTransform } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/core';

/**
 * The pipe should get the current routed state the user is on
 */
@Pipe({
    name: 'app',
    standalone: true,
})
export class AppPipe implements PipeTransform {
    constructor(public uiglobals: UIRouterGlobals) {}

    transform(input: string): any {
        return this.uiglobals.$current.name.includes(input);
    }
}
