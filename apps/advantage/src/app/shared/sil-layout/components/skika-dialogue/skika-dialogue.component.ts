/**
 * Imports used in the component
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Contains the component decorator and defines
 * the selector, style url, and template
 */
@Component({
    selector: 'skika-dialogue',
    styleUrls: ['./skika-dialogue.component.scss'],
    templateUrl: './skika-dialogue.component.html',
    standalone: false,
})
export class SkikaDialogueComponent {
    /**
     * Contains the state in use
     */
    @Input() state: boolean | Object;

    /**
     * Used to determine the service to use
     */
    @Input() heading: string;

    /**
     * Used to define the subheading of the dialog
     */
    @Input() subheading: string;

    /**
     * Used to determin
     */
    @Input() small: boolean = false;

    /**
     * Used to determine whether one wants a wide dialog
     */
    @Input() wide?: boolean = false;

    /**
     * Used to display header actions on the dialog
     */
    @Input() showHeaderAction?: boolean = false;
    /**
     * Used to display header on the dialog
     */
    @Input() showHeading?: boolean = true;

    /**
     * Used to determin if the dialog has been toggled
     */
    @Output() toggleModal = new EventEmitter();

    /**
     * Used to determine if the header action has been triggered
     */
    @Output() headerAction = new EventEmitter();

    toggleModalState() {
        this.toggleModal.emit();
    }

    toggleHeaderState() {
        this.headerAction.emit();
    }
}
