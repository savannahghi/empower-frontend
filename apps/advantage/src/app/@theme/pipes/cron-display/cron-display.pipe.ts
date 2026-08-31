import { Pipe, PipeTransform } from '@angular/core';
import cronstrue from 'cronstrue';

@Pipe({
    name: 'cronDisplay',
    standalone: true,
})
export class CronDisplayPipe implements PipeTransform {
    transform(value: string) {
        return cronstrue.toString(value);
    }
}
