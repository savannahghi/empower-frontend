import { Component, OnInit } from '@angular/core';
import { FieldArrayType, FieldGroupTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'formly-repeat-section',
    styleUrls: ['./formly-repeat.component.scss'],
    templateUrl: './repeat-type.component.html',
    standalone: false,
})
export class RepeatTypeComponent
    extends FieldArrayType<FieldGroupTypeConfig>
    implements OnInit
{
    deleteFirstItem: boolean = false;
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        const { fieldGroup, fieldArray } = this.field;

        this.deleteFirstItem = this.field.props?.deleteFirstItem;

        if (
            fieldArray &&
            !fieldArray['fieldGroup'] &&
            fieldGroup &&
            fieldGroup.length === 0
        ) {
            setTimeout(() => {
                this.add();
            }, 200);
        } else if (
            this.field.fieldGroup &&
            this.field.fieldGroup.length === 0
        ) {
            setTimeout(() => {
                this.add();
            }, 200);
        }
    }
}
