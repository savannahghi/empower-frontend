import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import moment from 'moment';

@Component({
    selector: 'sil-form-datetimepicker',
    templateUrl: './sil-datetimepicker.component.html',
    styleUrls: ['./sil-datetimepicker.component.scss'],
    standalone: false,
})
export class SilFormDateTimepickerComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /** sets the minimum date */
    minimum: any;
    /** sets the max date */
    maximum: any;
    component: any;

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        if (this.formControl.value) {
            this.formControl.setValue(moment(this.formControl.value));
        }

        if (this.props.minimum === 'NOW') {
            this.minimum = moment();
        }
        if (this.props.maximum === 'NOW') {
            this.maximum = moment();
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
