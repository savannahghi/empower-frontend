import { Component, Input, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
/**
 * Component that is used to create the Patient Screening Report Page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-patient-screening-report',
    templateUrl: './patient-screening-report.component.html',
    styleUrls: ['./patient-screening-report.component.scss'],
    standalone: false,
})
/**
 * Class that creates the Patient Screening Report component
 */
export class PatientScreeningReportComponent implements OnInit {
    /**
     * The component constructor
     * @param uiglobals Access instance of uirouter global service
     * @param dataLayer - Connects to the datalayer service
     * @param errorHandler - Connects to the error handler service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService
    ) {}
    /**
     * ScreeningCancer Type
     */
    cancerType: string = '';
    /**
     * Encounter Id
     */
    encounterId: string;
    /**
     * User Message Segments
     */
    segments: any;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;
    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Defines the patient Id
     */
    patientId: string;

    /**
     * Defines person data
     */
    person: any = {
        id: '',
        name: '',
    };

    /** fetch patient's referrals */
    getSegments(personID) {
        const params = {
            person: personID,
            fields: 'id,segment,enrolled_at',
        };
        this.loading = true;
        this.dataLayer.list('patient-segments', params).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.segments = response.results;
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this, 'clinical');
            },
        });
    }

    getPatientInfo() {
        /** Resolved observable from the state */
        this.patientObservable.subscribe(
            (response: any) => {
                this.person = {
                    ...this.person,
                    id: response?.person?.id,
                    name: response?.person?.first_name,
                };
                this.getSegments(this.person?.id);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
    /** when component mounts */

    ngOnInit() {
        this.cancerType = this.uiglobals.params.cancerType;
        this.encounterId = this.uiglobals.params.encounterId;

        this.patientId = this.uiglobals.params.id;

        this.getPatientInfo();
    }
}
