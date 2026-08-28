import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Component used to render radio buttons in a form
 */
@Component({
    selector: 'ngx-skika-radio',
    styleUrls: ['./sil-radio.component.scss'],
    template: `
        <div class="form-group-control">
            <label for="{{ props.label }}" class="label">
                {{ props.label }}
                <span
                    class="text-danger"
                    *ngIf="props.required"
                    style="font-size:0.85rem;">
                    *
                </span>
            </label>
            <nb-radio-group
                [(ngModel)]="props.model"
                [formControl]="formControl"
                [formlyAttributes]="field"
                [name]="props.name">
                <nb-radio
                    *ngFor="let opt of options$"
                    value="{{ opt.value }}"
                    [checked]="opt.checked"
                    #radioSelected
                    (valueChange)="radioChange($event)">
                    {{ opt.label }}
                </nb-radio>
            </nb-radio-group>
        </div>
    `,
    standalone: false,
})
/** Constructor for the radio button component */
export class SilRadioComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /** Detects when the radio value changes */
    radioChange($event) {
        const radioValue = $event;
        this.props.model = radioValue;
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

        this.props.model = this.props.model || this.props.defaultValue;
    }
}
