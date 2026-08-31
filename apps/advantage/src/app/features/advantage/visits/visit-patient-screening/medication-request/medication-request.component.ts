import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbTagModule,
    NbToastrModule,
    NbTooltipModule,
} from '@nebular/theme';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { SkikaLayoutModule } from '../../../../../shared/sil-layout/sil-layout.module';
import { StatusColorPipe } from '../../../../../@theme/pipes';
import { DisplayCardComponent } from '../screening-report/display-card/display-card.component';
import { UIRouterGlobals } from '@uirouter/angular';
import { SinglePrescriptionModel } from '../../../models/Prescription.model';

/**
 * Component that is used to create the Medication Requests Page
 *
 * - selector: used to define how to use the component in a template
 * - standalone: boolean indicating that the component is a standalone component
 * - imports: Modules and components used in the component
 * - templateUrl: contains the html structure of the component
 * - styleUrl: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-medication-request',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbCardModule,
        NbToastrModule,
        NbTagModule,
        NbTooltipModule,
        NgxSkeletonLoaderModule,
        SkikaLayoutModule,
        StatusColorPipe,
        DisplayCardComponent,
    ],
    templateUrl: './medication-request.component.html',
    styleUrl: './medication-request.component.scss',
})
/**
 * Class that creates the Medication Requests component
 */
export class MedicationRequestComponent implements OnInit {
    /**
     * Shows the loading of the medication request
     */
    @Input() loading: boolean = true;
    /**
     * The component constructor
     * @param uiglobals - Connects to the uiglobals service
     */
    constructor(public uiglobals: UIRouterGlobals) {}
    /**
     * Medication Request data
     */
    @Input() medicationRequest: SinglePrescriptionModel;

    /**
     * sets the visit id from the ui globals state
     */
    visitId: string = this.uiglobals.params.id;
    /**
     * Medication request data
     */
    requestData: any = {
        medication: 'Amoxicillin',
        diagnosis: 'Benign Breast Tissue',
        priority: 'urgent',
        ordered_on: 'Oct 21, 2024',
        ordered_by: 'Dr. Monica',
        facility: 'Empower Coast General',
        notes: 'Take before meals',
        tasks: [
            {
                id: '340502',
                name: 'Add Test Results',
                status: 'complete',
                timeRecorded: '2024-11-11T11:27:47Z',
            },
        ],
    };
    /**
     * Function to navigate back to the report
     */
    returnBack() {
        window.history.back();
        return;
    }
    /**
     * Text and colors that are rendered based on the screening results
     */
    badgeColors: any = {
        complete: {
            badgeColor: '#83AE04',
            badgeBackgroundColor: '#83AE0426',
        },
        pending: {
            badgeColor: '#DA0A15',
            badgeBackgroundColor: '#DA0A1526',
        },
    };
    /**
     * Function used to determine the style properties of the badge
     * @param testValue  Value of the test
     * @returns css properties
     */
    getBadgeStyle(testValue: string) {
        return {
            background: this.badgeColors[testValue].badgeBackgroundColor,
            color: this.badgeColors[testValue].badgeColor,
        };
    }

    /**
     * Component lifecycle used after the component is initialized
     */

    ngOnInit() {}
}
