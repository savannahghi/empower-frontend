import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbButtonModule, NbCardModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../../../../../@theme/theme.module';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-display-card',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbCardModule,
        NbTooltipModule,
    ],
    templateUrl: './display-card.component.html',
    styleUrls: ['./display-card.component.scss'],
})
/**
 * This is the class definition of the component
 */
export class DisplayCardComponent implements OnInit {
    /**
     * The component constructor
     */
    constructor() {}
    /**
     * Card Title
     */
    @Input() title: string;
    /**
     * Card description
     */
    @Input() description: string;
    /**
     * Css style to apply to the card
     */
    @Input() badgeStyle: any;
    /**
     * Card description
     */
    @Input() hasValue: boolean;
    /**
     * Test or referral value to display
     */
    @Input() value: string;
    /**
     * CSS class to apply to the card
     */
    @Input() cssClass: string;
    /**
     * Dynamic card image
     */
    @Input() image?: string;

    /**
     * Function to call when the card is clicked
     */
    @Output() editFxn?: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Function to call when delete button is clicked
     */
    @Output() deleteFxn?: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Whether to show the edit button
     */
    @Input() showEdit: boolean = false;

    /**
     * Whether to show the delete button
     */
    @Input() showDelete: boolean = false;

    @Input() primaryIcd?: string;

    @Input() morphologyIcd?: string;

    /**
     * Component lifecycle used after the component is initialized
     */

    ngOnInit() {}
}
