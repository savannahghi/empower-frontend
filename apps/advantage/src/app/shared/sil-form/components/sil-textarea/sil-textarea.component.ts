import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Component used to render textareas in a form
 */
@Component({
    selector: 'sil-form-textarea',
    styleUrls: ['./sil-textarea.component.scss'],
    templateUrl: './sil-textarea.component.html',
    standalone: false,
})

/** Constructor for the radio button component */
export class SilFormTextareaComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    maxLength = 160; // Standard SMS character limit
    remainingCharacters: number = this.maxLength;
    messageParts = 1;

    ngOnInit() {
        this.updateCounter();
    }

    /** Calculate the character count and message parts */
    updateCounter() {
        if (this.field.formControl.value?.length) {
            this.setRemainingCharacters(this.field.formControl.value.length);
            // Calculate message parts
            this.messageParts = Math.ceil(
                this.field.formControl.value.length / this.maxLength
            );
        }
    }

    /** set reamaining characters */
    setRemainingCharacters(formValue) {
        const remainingCharacters =
            this.maxLength - (formValue % this.maxLength);
        this.remainingCharacters =
            remainingCharacters === 160 ? 0 : remainingCharacters;
    }

    /** Add text */
    addText(variable) {
        this.field.formControl.setValue(
            `${this.field.formControl.value} {{${variable}}}`
        );
    }
}
