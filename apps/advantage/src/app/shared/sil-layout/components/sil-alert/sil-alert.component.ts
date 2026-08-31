import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

import _ from 'underscore';
@Component({
    selector: 'sil-alert',
    styleUrls: ['./sil-alert.component.scss'],
    templateUrl: './sil-alert.component.html',
    standalone: false,
})
export class SilAlertComponent implements OnChanges {
    @Input() submitted: boolean;
    @Input() context: string;
    @Input() error: object;
    @Input() errors: any[];
    @Input() showMessages: any;
    @Input() messages: any;

    asyncError: any;
    asyncArrErr: any[];

    hideAlert() {
        this.submitted = !this.submitted;
    }

    errMap(errObj) {
        const errArray = [];
        const keys = _.keys(errObj);
        _.each(keys, key => {
            const obj: any = {};
            obj.key = key;
            if (_.isArray(errObj[key])) {
                _.each(errObj[key], msg => {
                    msg = `${key}: ${msg}`;
                    errArray.push(msg);
                });
            }
        });
        return errArray;
    }

    processError() {
        if (_.isObject(this.asyncError)) {
            this.asyncArrErr = this.errMap(this.asyncError);
        }
        if (_.isArray(this.asyncError)) {
            _.each(this.asyncError, err => {
                this.asyncArrErr.push(err);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.asyncError = !_.isUndefined(changes.error)
            ? changes.error.currentValue
            : undefined;
        if (this.asyncError) {
            this.processError();
        }
    }
}
