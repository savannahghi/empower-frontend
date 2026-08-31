import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'healthIdFormatter',
    standalone: false,
})
export class HealthIdFormatterPipe implements PipeTransform {
    transform(value: string): string {
        // Remove any existing spaces and then insert spaces every four characters
        return value
            .replace(/\s/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim();
    }
}
