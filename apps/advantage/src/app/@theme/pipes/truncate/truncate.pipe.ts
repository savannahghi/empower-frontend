import { Pipe, PipeTransform } from '@angular/core';

/** Pipe used to truncate a section of the string */
@Pipe({
    name: 'truncate',
    standalone: true,
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        if (value === null) {
            return '';
        }
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
