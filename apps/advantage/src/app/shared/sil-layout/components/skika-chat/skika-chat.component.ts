import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - style: contains the scss file used to style the component
 */
@Component({
    selector: 'skika-chat',
    templateUrl: './skika-chat.component.html',
    styleUrls: ['./skika-chat.component.scss'],
    standalone: false,
})

/**
 * This is the class defintion of the component
 */
export class SkikaChatComponent {
    /**
     * State is passed to the child component
     */
    @Input() state: boolean;

    /**
     * heading passed to child component
     */
    @Input() heading: string;

    /**
     * subheading passed to child component
     */
    @Input() subheading: string;

    /**
     * small passed to child component
     */
    @Input() small: boolean = false;
    /**
     * small passed to child component
     */
    @Input() classSize: any;
    /**
     * Class that defines what class to use to style the heading text
     */
    @Input() headingStyleClass?: string = '';

    /**
     * toggleDrawer passed to child component
     */
    @Output() toggleDrawer = new EventEmitter();

    /**
     * method to show/hide chat
     */
    toggleChatState() {
        this.toggleDrawer.emit();
    }
}
