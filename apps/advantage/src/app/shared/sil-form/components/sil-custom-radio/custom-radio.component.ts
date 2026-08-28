import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'formly-field-radio',
    styleUrls: ['./custom-radio.component.scss'],
    template: `
        <div class="screen-card d-flex flex-row radio-screen-card">
            <nb-card
                class="text-center px-2 inner-card"
                *ngFor="let opt of options$"
                (click)="radioChange(opt.value)"
                [ngClass]="{ activeBorder: props.model === opt.value }">
                <nb-card-body
                    [ngClass]="
                        props.size === 'small' ? 'small-card-padding' : ''
                    "
                    class="d-flex justify-content-between align-items-center">
                    <ng-container [ngSwitch]="props.size">
                        <p
                            *ngSwitchCase="'small'"
                            class="mt-3 font-weight-bold">
                            {{ opt.label }}
                        </p>
                        <h5 *ngSwitchDefault class="list-title mt-3">
                            {{ opt.label }}
                        </h5>
                    </ng-container>
                    <nb-radio-group
                        class="radio-group"
                        [(ngModel)]="props.model"
                        [formControl]="formControl"
                        [formlyAttributes]="field">
                        <nb-radio
                            [value]="opt.value"
                            [checked]="props.model === opt.value"></nb-radio>
                    </nb-radio-group>
                </nb-card-body>
            </nb-card>
        </div>
    `,
    standalone: false,
})
export class FormlyCustomRadioComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    radioChange(value: any) {
        this.formControl.setValue(value);
    }

    /**
     * Subject that contains the select options
     */
    options$: any;

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.options$ = this.props.options;
    }
}
