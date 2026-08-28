import { Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../../visit.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';

/**
 * Modal context types
 */
interface ModalInterface {
    test: boolean;
    medication: boolean;
    appointment: boolean;
}
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-exam-sign-off',
    templateUrl: './exam-sign-off.component.html',
    styleUrl: './exam-sign-off.component.scss',
    standalone: false,
})
/**
 * Class that creates the Exam Sign off component
 */
export class ExamSignOffComponent implements OnInit {
    /**
     * key value pairs for the toggle object
     */
    toggle: ModalInterface = {
        test: false,
        medication: false,
        appointment: false,
    };
    /**
     * The component constructor
     * @param visitService injects instance of the visit service
     * @param uiglobals injects the global values from ui router
     * @param $state injects instance of the State Service
     * @param errorHandler injects instance of the Error Handler Service
     */
    constructor(
        private visitService: VisitService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public errorHandler: ErrorHandlerService
    ) {}
    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains visit Id
     */
    visitId: string;
    /** stores patient's visit date */
    visitDate: any;
    /**
     * Contains patient information
     */
    patient: any;
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;
    /**
     * Tests attached to the diagnosis
     */
    tests: Array<any> = [
        {
            id: '6642',
            name: 'Complete Blood Count(CBC)',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
            copay: 'KES 10,500.00',
        },
        {
            id: '6643',
            name: 'Magnetic Resonance Imaging(MRI)',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
            copay: 'KES 12,500.00',
        },
    ];
    /**
     * Medications attached to the diagnosis
     */
    medications: Array<any> = [
        {
            id: '1642',
            name: 'Amoxicilin Clavulic - acid 400MG tablet',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
        },
        {
            id: '1643',
            name: 'Penicilin 50ML Injection',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
        },
    ];
    /**
     * Appointments attached to the diagnosis
     */
    appointments: Array<any> = [
        {
            id: '4643',
            date: '26-Sep, THU',
            startTime: '9:00 AM',
            endTime: '10:00 AM',
            status: 'ONGOING',
            reason: 'Follow-up on Diabetes',
            payment_type: 'CREDIT',
            provider: 'Nairobi Hospital',
            doctor: 'Dr John Muthee',
        },
        {
            id: '4644',
            date: '26-Sep, THU',
            startTime: '9:00 AM',
            endTime: '10:00 AM',
            status: 'CANCELLED',
            reason: 'Diabetes melitus follow-up',
            provider: 'Mombasa Hospital',
            doctor: 'Dr John Muthee',
        },
    ];
    /**
     * @param context has the different modal contexts
     */
    toggleModal(context: keyof ModalInterface) {
        this.toggle[context] = !this.toggle[context];
    }
    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
        });
    }
    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        this.visitId = this.uiglobals.params.id;

        this.visitPatientObservable();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
}
