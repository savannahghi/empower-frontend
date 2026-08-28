import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'ngx-sil-button-group',
    templateUrl: './sil-button-group.component.html',
    styleUrls: ['./sil-button-group.component.scss'],
    standalone: false,
})
export class SilButtonGroupComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /** contains single selected button value */
    singleSelectGroupValue = [];
    fieldData: any;
    control: FormControl;
    buttonGroupValue: any;
    constructor(private cd: ChangeDetectorRef) {
        super();
    }

    updateSingleSelectGroupValue(value): void {
        this.singleSelectGroupValue = value;
        this.buttonGroupValue = value[0];
        this.formControl.setValue(this.buttonGroupValue);
        this.cd.markForCheck();
    }

    ngOnInit() {
        if (!this.control) {
            this.control = new FormControl();
        }
    }

    selectOption(option: string) {
        this.control.setValue(option);
    }
}
