import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Component decorator for the form checkbox
 */
@Component({
    selector: 'sil-form-checkbox',
    template: `
        <div class="form-group-control">
            <nb-checkbox
                class="{{ props.className }}"
                name="props.name"
                ngDefaultControl
                [formControl]="formControl"
                [formlyAttributes]="field">
                <span>
                    {{ props.label }}
                    <span class="text-danger" *ngIf="props.required"> * </span>
                </span>
            </nb-checkbox>
        </div>
    `,
    standalone: false,
})
/**
 * form checkbox class component
 */
export class SilFormCheckboxComponent extends FieldType<FieldTypeConfig> {}
