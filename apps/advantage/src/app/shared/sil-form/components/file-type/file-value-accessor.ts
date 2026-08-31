import { Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'input[type=file]',
    host: {
        '(change)': 'onChange($event.target.files)',
        '(blur)': 'onTouched()',
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileValueAccessorDirective,
            multi: true,
        },
    ],
    standalone: false,
})
// https://github.com/angular/angular/issues/7341
export class FileValueAccessorDirective implements ControlValueAccessor {
    value: any;
    onChange = () => {};
    onTouched = () => {};

    writeValue() {}
    registerOnChange(fn: any) {
        this.onChange = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}
