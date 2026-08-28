import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../../../../../@theme/theme.module';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-action-card',
    imports: [CommonModule, ThemeModule, NbButtonModule, NbCardModule],
    templateUrl: './action-card.component.html',
    styleUrls: ['./action-card.component.scss'],
})
/**
 * This is the class definition of the component
 */
export class ActionCardComponent implements OnInit {
    /**
     * The component constructor
     */
    constructor() {}
    /**
     * Boolean used to indicate if the button is visible
     */
    @Input() hideAction?: boolean = false;
    /**
     * Dynamic card image
     */
    @Input() image: string;
    /**
     * Card Title
     */
    @Input() title: string;
    /**
     * Card description
     */
    @Input() description: string;
    /**
     * Action button text
     */
    @Input() btnText: string;
    /**
     * emitted when the function action button is clicked
     */
    @Output() customFxn: EventEmitter<void> = new EventEmitter<void>();
    /**
     * Component lifecycle used after the component is initialized
     */

    ngOnInit() {}
}
