import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Component used to render an input field in a form
 */
@Component({
    selector: 'sil-input',
    styleUrls: ['./sil-input.component.scss'],
    template: ` <div class="form-control-group position-relative">
        <label class="label" for="{{ key }}">
            {{ props.label }}
            <span
                class="text-danger"
                *ngIf="props.required && !props.noLabel"
                style="font-size:0.85rem;">
                *
            </span>
            <nb-icon
                *ngIf="props.helpText"
                style="width: 13px; margin-top: 3px;"
                nbTooltip="{{ props.helpText }}"
                icon="info-outline">
            </nb-icon>
        </label>
        <input
            nbInput
            style="display:block !important;border: 1px solid
        #bdbdbd;"
            type="{{ props.type === 'password' ? getInputType() : props.type }}"
            thousandSeparator=","
            pattern="{{ props.pattern }}"
            fullWidth
            hidden="{{ props.hidden }}"
            status="{{
                formControl.touched && formControl.invalid
                    ? 'danger'
                    : 'default'
            }}"
            [formControl]="formControl"
            max="{{ props.max }}"
            min="{{ props.min }}"
            [formlyAttributes]="field"
            fieldSize="large"
            [mask]="props.mask"
            [prefix]="props.prefix"
            [attr.disabled]="props.disabled" />

        <button
            *ngIf="props.type === 'password'"
            nbSuffix
            nbButton
            ghost
            type="button"
            class="position-absolute"
            style="
                top: 20px !important;
                right: 0px !important;
            "
            (click)="toggleShowPassword()">
            <nb-icon
                [icon]="showPassword ? 'eye-outline' : 'eye-off-2-outline'"
                pack="eva"
                [attr.aria-label]="
                    showPassword ? 'hide password' : 'show password'
                ">
            </nb-icon>
        </button>

        <ng-container *ngIf="formControl.touched && formControl.invalid">
            <ul class="mt-2 list-inline text-danger err-cont">
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.required">
                    This field is required
                </li>
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.uniqueItem">
                    {{ formControl.errors?.uniqueItem.message }}
                </li>
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.min">
                    This field should be more than {{ props.min }}
                </li>
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.max">
                    This field should not be more than {{ props.max }}
                </li>
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.pattern">
                    Enter a valid email
                </li>
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.minLength">
                    {{ props.label }} should be at least
                    {{ formControl.errors.minLength.requiredLength }}
                    letters
                </li>
                <li
                    class="list-inline-item text-danger"
                    *ngIf="formControl.errors?.fieldMatch">
                    Password does not match
                </li>
            </ul>
        </ng-container>
    </div>`,
    standalone: false,
})

/**
 * Constructor for the input component
 *  */
export class SilInputComponent extends FieldType<FieldTypeConfig> {
    /**
     * Used to get the type of the input
     * @returns string that defines the input type
     */
    getType() {
        return this.props.type || 'text';
    }

    showPassword: boolean = false;

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    /** Change input type */
    getInputType() {
        if (this.showPassword) {
            return 'text';
        }
        return 'password';
    }
}
