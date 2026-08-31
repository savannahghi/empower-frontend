import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbButtonModule } from '@nebular/theme';
import { ThemeModule } from '../../../../../../@theme/theme.module';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-section-title',
    imports: [CommonModule, ThemeModule, NbButtonModule],
    templateUrl: './section-title.component.html',
    styleUrl: './section-title.component.scss',
})
/**
 * This is the class definition of the component
 */
export class SectionTitleComponent implements OnInit {
    /**
     * The component constructor
     */
    constructor() {}
    /**
     * Boolean used to indicate if the button is visible
     */
    @Input() showAction?: boolean = true;
    /**
     * Card Title
     */
    @Input() title?: string;
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
