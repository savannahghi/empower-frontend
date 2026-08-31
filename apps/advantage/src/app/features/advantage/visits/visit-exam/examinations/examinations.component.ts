import { Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../../visit.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { VisitExamService } from '../visit-exam.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-examinations',
    templateUrl: './examinations.component.html',
    styleUrl: './examinations.component.scss',
    standalone: false,
})
/**
 * Class that creates the Examinations component
 */
export class ExaminationsComponent implements OnInit {
    /**
     * The component constructor
     * @param visitService injects instance of the visit service
     * @param uiglobals injects the global values from ui router
     * @param $state injects instance of the State Service
     * @param errorHandler injects instance of the Error Handler Service
     * @param visitExamService Access an instance of the Visit Exam Service
     */
    constructor(
        private visitService: VisitService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public errorHandler: ErrorHandlerService,
        public visitExamService: VisitExamService
    ) {}

    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains visit Id
     */
    visitId: string;
    /**
     * Contains patient information
     */
    patient: any;
    /**
     * Definition of the template components in the patient examination step
     */
    examTemplate: any[] = this.visitExamService.examTemplateSettings;

    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

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
