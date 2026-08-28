import { CommonModule, DatePipe } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

interface DiagnosisOption {
    name: string;
    code: string;
}

interface DiagnosisRecord {
    code: string;
    name: string;
    date: string;
    enrolled: 'yes' | 'no';
    facility: string;
    program: string;
    enrollDate: string;
}

interface Toast {
    id: number;
    message: string;
    kind: 'ok' | 'warn';
}

interface DiagnosisRecords {
    TotalCount: 2;
    Edges: [
        {
            Node: {
                id: string;
                status: string;
                condition: string;
                code: string;
                system: string;
                category: string;
                onsetDate?: string;
                recordedDate: string;
                note: string;
                patientID: string;
                encounterID: string;
                oncologyCondition: any;
                treatmentLinkage: {
                    linkedToTreatment?: boolean;
                    treatmentFacility?: string;
                    treatmentProgram?: string;
                    enrollmentDate?: string;
                };
            };
            Cursor: string;
        }
    ];
    PageInfo: {
        HasNextPage: boolean;
        EndCursor: string;
        HasPreviousPage: boolean;
        StartCursor: string;
    };
}

/**
 * Scaffold for the Diagnosis & Linkage tab, mirroring the Claude design mockup.
 * Uses static in-memory data only - not wired to backend services yet.
 */
@Component({
    selector: 'ngx-diagnosis-linkage',
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './diagnosis-linkage.component.html',
    styleUrl: './diagnosis-linkage.component.scss',
})
export class DiagnosisLinkageComponent implements OnInit, OnDestroy {
    diagnosisOptions: DiagnosisOption[] = [];

    searching = false;

    recordsLoading = true;

    savingDiagnosis = false;

    /**
     * constains the encounter id for the visit
     */
    encounterId?: string;

    /**
     * patient id
     */
    patientId?: string;

    /**
     * contains the visit information resolved from the state

     */
    @Input() visitObservable: any;

    private searchTerms$ = new Subject<string>();
    private searchSubscription?: Subscription;
    private searchRequestId = 0;

    readonly programOptions: string[] = [
        'Cervical cancer treatment pathway',
        'Breast cancer treatment pathway',
        'Chemotherapy programme',
        'Radiotherapy programme',
        'Surgical management',
        'Hormonal therapy programme',
        'Palliative care programme',
    ];

    readonly severityOptions: string[] = ['Mild', 'Moderate', 'Severe'];

    view: 'list' | 'form' = 'list';

    searchQuery = '';
    showDropdown = false;
    activeIndex = -1;
    selectedDiagnosis: DiagnosisOption | null = null;

    dateConfirmed = '';
    enrolledChoice: 'yes' | 'no' | null = null;
    facility = '';
    program = '';
    enrollDate = '';
    severity = '';

    errors = {
        diagnosis: false,
        date: false,
        facility: false,
        program: false,
        enrollDate: false,
        severity: false,
    };

    records: DiagnosisRecord[] = [];

    toasts: Toast[] = [];
    private toastId = 0;

    readonly todayIso = new Date().toISOString().slice(0, 10);

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        public dataLayer: SilStoresService
    ) {}

    ngOnInit(): void {
        this.searchSubscription = this.searchTerms$
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(query => {
                if (!query) {
                    this.searchRequestId++;
                    this.diagnosisOptions = [];
                    this.searching = false;
                    return;
                }
                this.searchDiagnosis(query);
            });

        // set the encounterId
        this.visitObservable.subscribe((response: any) => {
            const visit = response;
            this.encounterId = visit?.service_requests[0].encounter_id;
            this.patientId = visit?.patient_id;
            this.fetchDiagnosisRecords();
        });
    }

    ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
    }

    fetchDiagnosisRecords() {
        this.dataLayer
            .list('condition-list', {
                strategy: 'linkage',
                patient_id: this.patientId,
            })
            .subscribe({
                next: (data: any) => {
                    this.records = (data as DiagnosisRecords).Edges.map(
                        item => {
                            const linkage = item.Node.treatmentLinkage ?? {};
                            const linked = linkage.linkedToTreatment === true;

                            return {
                                code: item.Node.code,
                                name: item.Node.condition,
                                date: item.Node.recordedDate,
                                enrolled: linked ? 'yes' : 'no',
                                facility: linked
                                    ? linkage.treatmentFacility ?? ''
                                    : '',
                                program: linked
                                    ? linkage.treatmentProgram ?? ''
                                    : '',
                                enrollDate: linked
                                    ? linkage.enrollmentDate ?? ''
                                    : '',
                            };
                        }
                    );
                    this.recordsLoading = false;
                },
                error: () => {
                    this.records = [];
                    this.recordsLoading = false;
                },
            });
    }

    /**
     * seaerches for a diagnosis in the OCL diagnoses store and updates the diagnosisOptions array
     * @param query search query params
     */
    searchDiagnosis(query: string): void {
        const requestId = ++this.searchRequestId;
        this.searching = true;
        this.dataLayer.list('ocl-diagnoses', { q: query }).subscribe({
            next: (data: any) => {
                if (requestId !== this.searchRequestId) return;
                this.diagnosisOptions = (
                    data as Array<{ display_name: string; id: string }>
                )
                    .map(item => ({
                        name: item.display_name,
                        code: item.id,
                    }))
                    .filter(
                        option =>
                            !this.selectedDiagnosis ||
                            this.selectedDiagnosis.code !== option.code
                    );
                this.searching = false;
            },
            error: () => {
                if (requestId !== this.searchRequestId) return;
                this.diagnosisOptions = [];
                this.searching = false;
            },
        });
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (
            this.showDropdown &&
            !this.elementRef.nativeElement
                .querySelector('.combo')
                ?.contains(event.target as Node)
        ) {
            this.closeDropdown();
        }
    }

    showForm(): void {
        this.resetForm();
        this.view = 'form';
    }

    showList(): void {
        this.view = 'list';
    }

    openDropdown(): void {
        this.showDropdown = true;
        this.activeIndex = -1;
    }

    closeDropdown(): void {
        this.showDropdown = false;
        this.activeIndex = -1;
    }

    onSearchInput(): void {
        this.showDropdown = true;
        this.activeIndex = -1;
        this.searchTerms$.next(this.searchQuery.trim());
    }

    onSearchKeydown(event: KeyboardEvent): void {
        const options = this.diagnosisOptions;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.showDropdown = true;
            this.activeIndex = options.length
                ? (this.activeIndex + 1) % options.length
                : -1;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.activeIndex = options.length
                ? (this.activeIndex - 1 + options.length) % options.length
                : -1;
        } else if (event.key === 'Enter') {
            if (
                this.showDropdown &&
                this.activeIndex >= 0 &&
                options[this.activeIndex]
            ) {
                event.preventDefault();
                this.selectDiagnosis(options[this.activeIndex]);
            }
        } else if (event.key === 'Escape') {
            this.closeDropdown();
        } else if (
            event.key === 'Backspace' &&
            !this.searchQuery &&
            this.selectedDiagnosis
        ) {
            this.removeDiagnosis();
        }
    }

    selectDiagnosis(option: DiagnosisOption): void {
        this.selectedDiagnosis = option;
        this.searchQuery = '';
        this.diagnosisOptions = [];
        this.errors.diagnosis = false;
        this.activeIndex = -1;
        this.closeDropdown();
    }

    removeDiagnosis(): void {
        this.selectedDiagnosis = null;
    }

    onDateConfirmedChange(): void {
        if (this.dateConfirmed) this.errors.date = false;
    }

    onEnrollChange(value: 'yes' | 'no'): void {
        this.enrolledChoice = value;
        if (value === 'no') {
            this.errors.facility = false;
            this.errors.program = false;
            this.errors.enrollDate = false;
        }
    }

    onFacilityInput(): void {
        if (this.facility.trim()) this.errors.facility = false;
    }

    onProgramChange(): void {
        if (this.program) this.errors.program = false;
    }

    onSeverityChange(): void {
        if (this.severity) this.errors.severity = false;
    }

    onEnrollDateChange(): void {
        if (this.enrollDate) this.errors.enrollDate = false;
    }

    /**
     * savesa a diagnosis record
     * @returns
     */
    save(): void {
        this.errors.diagnosis = !this.selectedDiagnosis;
        this.errors.date = !this.dateConfirmed;
        this.errors.severity = !this.severity;
        const enrollmentMissing = !this.enrolledChoice;

        if (this.enrolledChoice === 'yes') {
            this.errors.facility = !this.facility.trim();
            this.errors.program = !this.program;
            this.errors.enrollDate = !this.enrollDate;
        } else {
            this.errors.facility = false;
            this.errors.program = false;
            this.errors.enrollDate = false;
        }

        if (
            this.errors.diagnosis ||
            this.errors.date ||
            this.errors.facility ||
            this.errors.program ||
            this.errors.enrollDate ||
            this.errors.severity
        ) {
            this.showToast(
                'Complete the highlighted fields to continue',
                'warn'
            );
            return;
        }
        if (enrollmentMissing) {
            this.showToast(
                'Select whether the patient has been enrolled for treatment',
                'warn'
            );
            return;
        }

        this.savingDiagnosis = true;

        const enrolledChoice = this.enrolledChoice as 'yes' | 'no';
        const diagnosis = this.selectedDiagnosis as DiagnosisOption;

        this.dataLayer
            .create('treatment-enrollment', {
                encounter_id: this.encounterId,
                condition: {
                    code: diagnosis.code,
                    display: diagnosis.name,
                },
                date: this.dateConfirmed,
                severity: this.severity.toLowerCase(),
                linked_to_treatment: this.enrolledChoice === 'yes',
                ...(enrolledChoice === 'yes'
                    ? {
                          treatment_facility: this.facility.trim(),
                          treatment_program: this.program,
                          enrollment_date: this.enrollDate,
                      }
                    : {}),
            })
            .subscribe({
                next: () => {
                    this.showToast('Diagnosis saved to the visit record');
                    this.savingDiagnosis = false;
                    this.resetForm();
                    this.showList();
                    this.fetchDiagnosisRecords();
                },
                error: () => {
                    this.savingDiagnosis = false;
                    this.showToast('Error saving diagnosis', 'warn');
                },
            });
    }

    dismissToast(id: number): void {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    private resetForm(): void {
        this.searchQuery = '';
        this.selectedDiagnosis = null;
        this.diagnosisOptions = [];
        this.searching = false;
        this.searchTerms$.next('');
        this.showDropdown = false;
        this.activeIndex = -1;
        this.dateConfirmed = '';
        this.enrolledChoice = null;
        this.facility = '';
        this.program = '';
        this.enrollDate = '';
        this.severity = '';
        this.errors = {
            diagnosis: false,
            date: false,
            facility: false,
            program: false,
            enrollDate: false,
            severity: false,
        };
    }

    private showToast(message: string, kind: 'ok' | 'warn' = 'ok'): void {
        const id = ++this.toastId;
        this.toasts.push({ id, message, kind });
        setTimeout(() => this.dismissToast(id), 3200);
    }
}
