import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { PatientModel } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import moment from 'moment';
import { environment } from 'environments/environment';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { VisitService } from '../../visit.service';
import { forkJoin } from 'rxjs';

/**
 * Drawer context types
 */
interface DrawerInterface {
    'add-diagnostic-drawer': boolean;
    'add-diagnosis-drawer': boolean;
    'add-regimen-drawer': boolean;
    'add-premedication-drawer': boolean;
    'edit-medication-drawer': boolean;
    'add-appointment-drawer': boolean;
}

interface PremedicationDayType {
    title: string;
    description: string;
    timingTiming: any;
    action: any[];
}

interface FormSelectOptions {
    method: { code: string; display: string }[];
    route: { code: string; display: string }[];
}
@Component({
    selector: 'ngx-visit-patient-treatment',
    templateUrl: './visit-patient-treatment.component.html',
    styleUrl: './visit-patient-treatment.component.scss',
    standalone: false,
})
export class VisitPatientTreatmentComponent implements OnInit {
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * stores workstation
     */
    workstation: any;

    /**
     * ERP Organization data
     */
    erpOrgData: any;

    /**
     * Contains patient information
     */
    patient: PatientModel;

    /**
     * Toggles the drawer
     */
    toggle: Object = {};

    /**
     * Used to display different loading sections
     */
    loading: any = {};

    /**
     * Used to determine duration of the toast time
     */
    toastTime = 7000;

    /**
     * Controls the visibility of the embedded Regimen form
     */
    showRegimenForm: boolean = false;

    /**
     * Contains visit data
     */
    visitData: any;

    /**
     * Encounter ID for the visit
     */
    encounterId: any;
    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Array used to define the default headers of the datatable
     */
    headers: Array<any>;

    /**
     * contains the FHIR server url
     */
    fhirServerUrl = environment.fhirServerUrl;

    /**
     * Contains the template settings for the treatment component
     */
    templateSettings: any[] = [
        {
            id: 'regimen',
            name: 'Regimen',
            display: 'Regimen',
            isHidden: false,
            selected: true,
        },
        {
            id: 'premedication',
            name: 'Pre-medications',
            display: 'Pre-medications',
            isHidden: false,
            selected: true,
        },
        {
            id: 'appointment',
            name: 'Appointment',
            display: 'Schedule Appointment',
            isHidden: false,
            selected: true,
        },
        {
            id: 'additional_notes',
            name: 'Additional Notes',
            display: 'Additional Notes',
            isHidden: false,
            selected: true,
        },
    ];

    /**
     * Stores the medication regimen data
     */
    medicationRegimen: {
        name: string;
        dose: string;
        method: string;
        route: string;
        id?: string;
        doseQuantity?: number;
        doseUnit?: string;
    }[] = [];

    /**
     * Stores the plan definition data
     */
    planDefinitionData: any[] = [];

    /**
     * Stores the selected regimen data
     */
    selectedRegimen: any = null;

    /**
     * Stores the additional notes
     */
    additionalNotes: string = '';

    /**
     * Stores the premedication data state
     */
    premedicationLoading: boolean = false;

    /**
     * holds the edit medication form options for select input
     */
    formSelectOptions: FormSelectOptions = { method: [], route: [] };

    /**
     * Component constructor
     * @param translate instance of TranslationService
     * @param cdr used to detect changes in the component
     * @param cookieService used to access the cookie service (SilCookieService)
     * @param dataLayer used to access the data layer service (SilStoresService)
     * @param errorHandler used to handle errors
     * @param toastrService used to access the toast service
     */
    constructor(
        public translate: TranslateService,
        private cdr: ChangeDetectorRef,
        private cookieService: Cookies,
        public http: HttpClient,
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public visitService: VisitService,
        public authService: Authorization
    ) {
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }

    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Function used to toggle the drawers
     * @param context has the different drawer contexts
     */
    toggleDrawer(context: keyof DrawerInterface | 'add-regimen-form') {
        if (context === 'add-regimen-form') {
            this.showRegimenForm = !this.showRegimenForm;
        } else {
            this.toggle[context] = !this.toggle[context];
        }
    }

    /**
     * Function called when regimen form is submitted or cancelled within ngx-visit-regimen
     */
    onRegimenFormAction() {
        this.showRegimenForm = false;
    }

    carePlanData: any;

    /**
     * Toogle function to display or hide treatment sections
     * @param sectionId The unique identifier for the section to toggle
     */
    toggleIsHidden(sectionId: string) {
        const section = this.templateSettings.find(s => s.id === sectionId);
        if (section) {
            section.isHidden = !section.isHidden;
            this.cdr.detectChanges();
        }
    }

    formConfig = {
        checkExpressionOn: 'changeDetectionCheck',
    };

    /**
     * Defines form submit state
     */
    submitting: boolean = false;

    /**
     * form data
     */
    diagnosisForm: Record<string, any> = {};

    /**
     * Selected scheduled date
     */
    returnDate: string = '';

    /**
     * Stores the minimum date
     */
    min: Object = moment();
    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param msg - defines what the message in the toast is
     * @param context - defines what the context of the toast is
     */
    showToast(position: any, status: string, context: string, msg: string) {
        const duration = this.toastTime;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Selected medication for editing
     */
    selectedMedication: any = null;

    /**
     * Edit a medication in the regimen
     * @param medication The medication to edit
     * @param index The index of the medication in the array
     */
    editMedication(medication: any) {
        const index = this.medicationRegimen.findIndex(
            item => item.id === medication.id
        );
        this.selectedMedication = { ...medication, index };
        this.toggleDrawer('edit-medication-drawer');
    }

    /**
     * Delete a medication from the regimen
     * @param index The index of the medication to delete
     */
    deleteMedication(index: number) {
        this.medicationRegimen.splice(index, 1);
        this.cdr.detectChanges();
    }

    /**
     * Save changes to the edited medication
     */
    saveMedicationChanges() {
        if (
            this.selectedMedication &&
            this.selectedMedication.index !== undefined
        ) {
            const { index, ...medicationData } = this.selectedMedication;
            this.medicationRegimen = this.medicationRegimen.map((item, i) =>
                i === index ? { ...item, ...medicationData } : item
            );
            this.toggleDrawer('edit-medication-drawer');
            this.selectedMedication = null;
            this.cdr.detectChanges();
        }
    }

    /**
     * @description fetches the premedication data for the regimen
     * @params day - the day selected for premedication
     * @returns void
     *
     */
    onMedicationDaySelected(day: PremedicationDayType) {
        this.premedicationLoading = true;
        this.medicationRegimen = [];

        const requests = day.action.map(action => {
            const definitionUrl = action?.definitionCanonical;
            return this.http.get(definitionUrl);
        });

        forkJoin(requests).subscribe({
            next: (responses: any[]) => {
                this.medicationRegimen = responses.map(response => {
                    const medicationId = response?.productReference?.id;
                    return {
                        name: response?.productReference?.display,
                        route: response?.dosage?.[0]?.route?.coding?.[0]
                            ?.display,
                        method: response?.dosage?.[0]?.method?.coding?.[0]
                            ?.display,
                        dose: '-',
                        id: medicationId,
                    };
                });
            },
            complete: () => {
                this.premedicationLoading = false;
                this.cdr.detectChanges();
            },
        });
    }

    /**
     * Handles when a regimen is selected from the regimen component
     * @param regimen The selected regimen data
     */
    onRegimenSelected(regimen: any) {
        this.selectedRegimen = regimen;
        this.cdr.detectChanges();
    }

    /**
     * Updates the additional notes value
     * @param event The input event containing the notes value
     */
    onNotesChange(event: any) {
        this.additionalNotes = event.target.value;
    }

    /**
     * Submit the medication regimen data to the server
     */
    submitData() {
        this.submitting = true;

        const currentDate = new Date();
        const startDate = currentDate.toISOString().split('T')[0];

        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 7);
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const medications = this.medicationRegimen.map(medication => {
            let doseQuantity = 2;
            let doseUnit = 'mg';

            if (medication.dose && medication.dose !== '-') {
                const doseMatch = medication.dose.match(
                    /([\d.]+)\s*([a-zA-Z]+)/
                );
                if (doseMatch) {
                    doseQuantity = parseFloat(doseMatch[1]);
                    doseUnit = doseMatch[2];
                }
            }

            let routeCode = 'iv';
            let routeDisplay = 'Intravenous';

            if (medication.route) {
                const routeMapping = {
                    intravenous: 'iv',
                    oral: 'po',
                    intramuscular: 'im',
                    subcutaneous: 'sc',
                    topical: 'top',
                };

                const lowerRoute = medication.route.toLowerCase();
                if (routeMapping[lowerRoute]) {
                    routeCode = routeMapping[lowerRoute];
                    routeDisplay = medication.route;
                }
            }

            return {
                medicationID: medication.id,
                priority: 'asap',
                dosageInstructions: [
                    {
                        route: {
                            code: routeCode,
                            display: routeDisplay,
                        },
                        doseQuantity: doseQuantity,
                        doseUnit: doseUnit,
                        period: '8',
                        periodUnit: 'h',
                        frequency: 1,
                        duration: '5',
                        durationUnit: 'd',
                        startDate: startDate,
                        endDate: formattedEndDate,
                        condition: medication.method,
                        patientInstruction: 'Take it after meals',
                        additionalInstruction: [''],
                        asNeeded: false,
                        freeTextInstruction: '',
                    },
                ],
            };
        });

        const medicationRequestPayload = {
            encounterID: this.encounterId,
            medications: medications,
        };

        this.dataLayer
            .create('medication-request', medicationRequestPayload)
            .subscribe({
                next: () => {
                    this.submitting = false;
                    this.submitCareplan();
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Treatment data submitted successfully!',
                        'Submission'
                    );
                },
                error: (err: any) => {
                    this.submitting = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Fetches the plan definition data
     */
    getPlanDefinition() {
        this.loading['planDefinition'] = true;
        this.dataLayer.get('plan-definition').subscribe({
            next: (response: any) => {
                if (response && response.edges) {
                    this.planDefinitionData = response.edges.map(
                        (edge: any) => edge.node
                    );
                } else {
                    this.planDefinitionData = [];
                }
                this.loading['planDefinition'] = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.loading['planDefinition'] = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * selected return date
     * @param event
     */
    handleReturnDateChange(event) {
        this.returnDate = event;
    }

    /**
     * Function used to book an appointment
     */
    scheduleNextAppointment() {
        this.loading['scheduleAppointment'] = true;
        const mainData = {
            encounterID: this.encounterId,
            patientID: this.patient.clinical_id,
            reason: 'Refer patient for treatment',
            date: moment(this.returnDate).format('YYYY-MM-DD'),
        };

        const headersInput = {
            organisation: this.erpOrgData.organisation_id,
            cluster: this.workstation['workstation__org_unit__parent__parent'],
            department: this.workstation['workstation__org_unit'],
            branch: this.workstation['workstation__org_unit__parent'],
            workstation: this.workstation['workstation'],
            variant: environment.variant,
        };
        const appointmentData = Object.assign({
            appointmentInput: {
                ...mainData,
            },
            headersInput: {
                ...headersInput,
            },
        });

        this.dataLayer
            .create('patient-appointment', appointmentData)
            .subscribe({
                next: () => {
                    this.loading['scheduleAppointment'] = false;
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        'Appointment created'
                    );
                },
                error: err => {
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Failed',
                        err?.error?.message
                            ? err.error.message
                            : 'Sorry, an error occured setting up the appointment. Please try again.'
                    );
                    this.loading['scheduleAppointment'] = false;
                    this.toggleDrawer('add-appointment-drawer');
                    this.cdr.detectChanges();
                },
            });

        return;
    }

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(
            (patient: PatientModel) => {
                this.patient = patient;
            }
        );
    }

    setEncounterId(serviceRequests: any) {
        if (serviceRequests && serviceRequests.length > 0) {
            this.encounterId = serviceRequests[0].encounter_id;
        }
    }

    /**
     * Fetches the careplan data
     */
    submitCareplan() {
        if (!this.selectedRegimen) {
            this.showToast(
                'bottom-right',
                'warning',
                'No regimen selected',
                'Please select a regimen before submitting'
            );
            return;
        }

        const careplanPayload = {
            encounterID: this.encounterId,
            planDefinitionID: this.selectedRegimen.id,
            notes: this.additionalNotes,
        };

        this.loading['careplan'] = true;
        this.dataLayer.create('careplan', careplanPayload).subscribe({
            next: () => {
                this.loading['careplan'] = false;
                setTimeout(() => {
                    this.getCarePlan(this.encounterId);
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Care Plan submitted successfully!',
                        'Submission'
                    );
                    this.cdr.detectChanges();
                }, 1000);
            },
            error: (err: any) => {
                this.loading['careplan'] = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * @description: Fetches value sets
     */
    getValueSets() {
        this.http
            .get(`${this.fhirServerUrl}/fhir/ValueSet/sghi-method-value-set`)
            .subscribe({
                next: (response: any) => {
                    this.formSelectOptions.method =
                        response?.compose?.include?.[0]?.concept;
                },
                error: err => {
                    this.errorHandler.handleError(this, err);
                },
            });

        this.http
            .get(`${this.fhirServerUrl}/fhir/ValueSet/route-of-administration`)
            .subscribe({
                next: (response: any) => {
                    this.formSelectOptions.route =
                        response?.compose?.include?.[0]?.concept;
                },
                error: err => {
                    this.errorHandler.handleError(this, err);
                },
            });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.loading['carePlan'] = true;
        this.visitObservable.subscribe(
            (response: any) => {
                this.visitData = response;
                this.visitService.setVisitData(this.visitData);
                this.setEncounterId(response.service_requests);
                this.getCarePlan(this.encounterId);
            },
            (err: any) => {
                this.errorHandler.handleError(err, this);
            }
        );

        this.getPlanDefinition();
        this.visitPatientObservable();
        this.visitObservable.subscribe(response => {
            this.visitData = response;
            this.encounterId = response?.service_requests[0].encounter_id;
            this.visitService.setVisitData(response);
        });
        this.workstation = this.authService.getWorkstation();
        this.erpOrgData = this.authService.getErpOrganisation();

        this.headers = [
            { text: 'Medication' },
            { text: 'Dose' },
            { text: 'Method' },
            { text: 'Route' },
            { text: 'Actions' },
        ];

        /**
         * Identifers table rows
         */
        this.rows = [
            {
                type: 'string',
                key: 'name',
            },
            {
                type: 'string',
                key: 'dose',
            },
            {
                type: 'string',
                key: 'method',
            },
            {
                type: 'string',
                key: 'route',
            },
        ];

        this.actions = this['actions'] = [
            {
                btnText: 'Edit',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];

        this.getValueSets();
    }

    /**
     * Fetches the care plan data for the visit
     * @param encounterId The encounter ID for the visit
     */
    getCarePlan(encounterId: string) {
        this.loading['carePlan'] = true;

        this.dataLayer
            .list('careplan', { encounterID: encounterId })
            .subscribe({
                next: (response: any) => {
                    this.carePlanData = { ...response, encounterId };
                    this.loading['carePlan'] = false;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.loading['carePlan'] = false;
                },
            });
    }
}
