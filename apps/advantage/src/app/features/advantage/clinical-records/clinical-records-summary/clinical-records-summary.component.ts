import { Component, Input, OnInit } from '@angular/core';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject } from 'rxjs';
import { MarkdownService } from 'ngx-markdown';

@Component({
    selector: 'ngx-clinical-records-summary',
    templateUrl: './clinical-records-summary.component.html',
    styleUrl: './clinical-records-summary.component.scss',
    standalone: false,
})
export class ClinicalRecordsSummaryComponent implements OnInit {
    /**
     * @param dataLayer datalayer service to interact with the backend
     */
    constructor(
        public dataLayer: SilStoresService,
        public markdownService: MarkdownService
    ) {}

    ngOnInit() {
        this.getObservationsForVisit();

        this.clinicalNotesLoaded.subscribe(loaded => {
            if (loaded) {
                this.summarizeClinicalNotes();
            }
        });
    }

    /** holds the clinical notes data */
    clinicalNotes: any = {};

    private clinicalNotesLoaded = new BehaviorSubject<boolean>(false);
    /** patient details */
    @Input() patient: any;

    /** holds the activeServiceRequest information */
    @Input() activeServiceRequest: any;

    /** loading state for the AI summary */
    summaryLoading: boolean = true;

    /** a variable that holds the error state */
    errorResponse: boolean = false;

    /** holds the clinica notes summarization */
    clinicalNotesSummary: string;

    /** A map fo rthe observations ad their corresponding concepts */
    observationConceptMap: { [key: string]: string } = {
        family_history: 'FAMILY_AND_SOCIAL_HISTORY',
        past_medical_surgery_history: 'PAST_MEDICAL_AND_SURGICAL_HISTORY',
        chief_complaint: 'CHIEF_COMPLAINT',
        history_of_present_illness: 'HISTORY_OF_PRESENTING_ILLNESS',
        examination: 'GENERAL_EXAMINATION',
    };

    /**
     * summarize clinical notes using AI
     */
    summarizeClinicalNotes() {
        // reinitialize loading state
        this.summaryLoading = true;
        this.errorResponse = false;
        const requestPayload = {
            full_name: this.patient?.person?.person_display,
            visit_id: this.activeServiceRequest?.id,
            patient_id: this.patient?.clinical_id,
            date_of_birth: this.patient?.person?.date_of_birth,
            gender: this.patient?.person?.gender,
            family_history:
                this.clinicalNotes?.family_history?.[0]?.node.value ??
                undefined,
            social_history:
                this.clinicalNotes?.social_history?.[0]?.node.value ??
                undefined,
            past_medical_surgery_history:
                this?.clinicalNotes?.past_medical_surgery_history?.[0]?.node
                    .value ?? undefined,
            chief_complaint:
                this.clinicalNotes?.chief_complaint?.[0]?.node.value ??
                undefined,
            history_of_presenting_illness:
                this.clinicalNotes?.history_of_present_illness?.[0]?.node
                    .value ?? undefined,
            examination:
                this.clinicalNotes?.examination?.[0]?.node.value ?? undefined,
            plan_of_care: this.clinicalNotes?.treatment_plan?.[0] ?? undefined,
        };
        this.dataLayer
            .create('summarize-clinical-notes', requestPayload)
            .subscribe({
                next: async (res: any) => {
                    const processedMarkdown = await this.markdownService.parse(
                        res.summarization.replace(
                            /START CONTEXT|END CONTEXT/g,
                            ''
                        )
                    );
                    this.summaryLoading = false;
                    this.clinicalNotesSummary = processedMarkdown;
                },
                error: () => {
                    this.summaryLoading = false;
                    this.errorResponse = true;
                },
            });
    }

    /**
     * gets all the observations for a specific encounter for summarization
     */
    getObservationsForVisit() {
        const params = {
            patient_id: this.patient.clinical_id,
            encounter_id: this.activeServiceRequest.encounter_id,
        };
        Object.entries(this.observationConceptMap).map(([key, concept]) =>
            this.dataLayer
                .get('observations', null, { ...params, concept })
                .subscribe({
                    next: (response: any) => {
                        this.clinicalNotes[`${key}`] = response.edges;
                    },
                    complete: () => {
                        const allKeys = Object.keys(this.observationConceptMap);
                        const loadedKeys = Object.keys(this.clinicalNotes);
                        if (
                            allKeys.every(obsKeys =>
                                loadedKeys.includes(obsKeys)
                            )
                        ) {
                            this.clinicalNotesLoaded.next(true);
                        }
                    },
                })
        );
    }
}
