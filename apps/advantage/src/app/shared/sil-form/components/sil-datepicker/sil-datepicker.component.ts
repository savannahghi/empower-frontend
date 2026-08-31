import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import moment from 'moment';

/**
 * Component used to render an datepicker field in a form.
 * Relies on nebular datepicker
 */
@Component({
    selector: 'sil-form-datepicker',
    styleUrls: ['./sil-datepicker.component.scss'],
    template: `
        <div class="form-control-group">
            <label style="margin-bottom: 3px;" for="{{ key }}">
                {{ props.label }}
                <span
                    class="text-danger"
                    *ngIf="props.required"
                    style="font-size:0.85rem;">
                    *
                </span>
            </label>
            <input
                nbInput
                fullWidth
                class="border"
                [nbDatepicker]="datepicker"
                status="{{
                    formControl.touched && formControl.invalid
                        ? 'danger'
                        : 'default'
                }}"
                [formControl]="formControl"
                [formlyAttributes]="field"
                fieldSize="large" />
            <nb-datepicker
                #datepicker
                format="{{ props.dateFormat }}"
                [min]="props.min"
                [max]="props.max"
                (dateChange)="dateChange($event)">
            </nb-datepicker>
            <ng-container *ngIf="formControl.touched && formControl.invalid">
                <ul class="list-inline text-danger err-cont">
                    <li
                        class="list-inline-item text-danger"
                        *ngIf="formControl.errors?.required">
                        This field is required
                    </li>
                    <li
                        class="list-inline-item text-danger"
                        *ngIf="formControl.errors?.pattern">
                        Enter a valid date
                    </li>
                </ul>
            </ng-container>
        </div>
    `,
    standalone: false,
})
/**
 * Constructor for the datepicker component
 */
export class SilFormDatepickerComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        const val = this.formControl.value;
        if (!val) {
            const today = new Date();
            if (!this.props.dateFormat) {
                this.formControl.setValue(moment(today));
            }
        } else {
            if (!moment.isMoment(val)) {
                this.formControl.setValue(moment(val));
            }
        }
    }

    /**
     * Detects when the date changes
     * @param $event contains the date object
     */
    dateChange($event) {
        let dateValue = $event;
        if (this.props.dateFormat) {
            dateValue = $event.format(this.props.dateFormat);
            const key = this.key;
            this.model[`${key}`] = dateValue;
        }
        this.props.options = [this.field, dateValue];
    }
}
