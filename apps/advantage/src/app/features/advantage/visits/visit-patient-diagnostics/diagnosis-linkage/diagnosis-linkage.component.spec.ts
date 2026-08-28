import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { Observable, Subscriber, of, throwError } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

import { DiagnosisLinkageComponent } from './diagnosis-linkage.component';

describe('DiagnosisLinkageComponent', () => {
    let component: DiagnosisLinkageComponent;
    let fixture: ComponentFixture<DiagnosisLinkageComponent>;
    let dataLayerSpy: jasmine.SpyObj<SilStoresService>;

    beforeEach(async () => {
        dataLayerSpy = jasmine.createSpyObj('SilStoresService', [
            'list',
            'create',
        ]);
        dataLayerSpy.list.and.callFake((endpoint: string) =>
            endpoint === 'condition-list' ? of({ Edges: [] }) : of([])
        );
        dataLayerSpy.create.and.returnValue(of({}));

        await TestBed.configureTestingModule({
            imports: [DiagnosisLinkageComponent],
            providers: [{ provide: SilStoresService, useValue: dataLayerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(DiagnosisLinkageComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            service_requests: [{ encounter_id: 'enc-1' }],
            patient_id: 'patient-1',
        });
        fixture.detectChanges();
    });

    function selectDiagnosisAndBasics(): void {
        component.selectDiagnosis({ name: 'Ovarian carcinoma', code: 'C56.9' });
        component.dateConfirmed = '2026-07-01';
        component.severity = 'Moderate';
    }

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('starts on the list view with no records until the fetch resolves', () => {
        expect(component.view).toBe('list');
        expect(component.records.length).toBe(0);
    });

    it('resolves the encounter and patient id from the visit observable and fetches records', () => {
        expect(component.encounterId).toBe('enc-1');
        expect(component.patientId).toBe('patient-1');
        expect(dataLayerSpy.list).toHaveBeenCalledWith('condition-list', {
            strategy: 'linkage',
            patient_id: 'patient-1',
        });
    });

    it('fetches diagnosis records and maps the API fields', () => {
        dataLayerSpy.list.and.returnValue(
            of({
                Edges: [
                    {
                        Node: {
                            code: 'C53.9',
                            condition: 'Invasive cervical carcinoma',
                            recordedDate: '2026-06-17',
                            treatmentLinkage: {
                                linkedToTreatment: true,
                                treatmentFacility: 'Kenyatta National Hospital',
                                treatmentProgram:
                                    'Cervical cancer treatment pathway',
                                enrollmentDate: '2026-06-18',
                            },
                        },
                    },
                ],
            })
        );
        component.fetchDiagnosisRecords();
        expect(dataLayerSpy.list).toHaveBeenCalledWith('condition-list', {
            strategy: 'linkage',
            patient_id: 'patient-1',
        });
        expect(component.records).toEqual([
            {
                code: 'C53.9',
                name: 'Invasive cervical carcinoma',
                date: '2026-06-17',
                enrolled: 'yes',
                facility: 'Kenyatta National Hospital',
                program: 'Cervical cancer treatment pathway',
                enrollDate: '2026-06-18',
            },
        ]);
    });

    it('marks a record as not enrolled when the API omits treatment linkage', () => {
        dataLayerSpy.list.and.returnValue(
            of({
                Edges: [
                    {
                        Node: {
                            code: 'C54.1',
                            condition: 'Endometrial carcinoma',
                            recordedDate: '2026-06-20',
                        },
                    },
                ],
            })
        );
        component.fetchDiagnosisRecords();
        expect(component.records).toEqual([
            {
                code: 'C54.1',
                name: 'Endometrial carcinoma',
                date: '2026-06-20',
                enrolled: 'no',
                facility: '',
                program: '',
                enrollDate: '',
            },
        ]);
    });

    it('defaults linkage fields to empty strings when the API omits them', () => {
        dataLayerSpy.list.and.returnValue(
            of({
                Edges: [
                    {
                        Node: {
                            code: 'C56.9',
                            condition: 'Ovarian carcinoma',
                            recordedDate: '2026-06-21',
                            treatmentLinkage: {
                                linkedToTreatment: true,
                            },
                        },
                    },
                ],
            })
        );
        component.fetchDiagnosisRecords();
        expect(component.records).toEqual([
            {
                code: 'C56.9',
                name: 'Ovarian carcinoma',
                date: '2026-06-21',
                enrolled: 'yes',
                facility: '',
                program: '',
                enrollDate: '',
            },
        ]);
    });

    it('clears records when fetching diagnosis records fails', () => {
        component.records = [
            {
                code: 'C53.9',
                name: 'Invasive cervical carcinoma',
                date: '2026-06-17',
                enrolled: 'yes',
                facility: '',
                program: '',
                enrollDate: '',
            },
        ];
        dataLayerSpy.list.and.returnValue(
            throwError(() => new Error('network error'))
        );
        component.fetchDiagnosisRecords();
        expect(component.records).toEqual([]);
    });

    it('resets the form and switches to the form view when recording a diagnosis', () => {
        component.selectedDiagnosis = {
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        };
        component.severity = 'Severe';
        component.showForm();
        expect(component.view).toBe('form');
        expect(component.selectedDiagnosis).toBeNull();
        expect(component.severity).toBe('');
    });

    it('searches the OCL diagnoses store and maps the results', () => {
        dataLayerSpy.list.and.returnValue(
            of([{ display_name: 'Ovarian carcinoma', id: 'C56.9' }])
        );
        component.searchDiagnosis('ovarian');
        expect(dataLayerSpy.list).toHaveBeenCalledWith('ocl-diagnoses', {
            q: 'ovarian',
        });
        expect(component.diagnosisOptions).toEqual([
            { name: 'Ovarian carcinoma', code: 'C56.9' },
        ]);
        expect(component.searching).toBe(false);
    });

    it('excludes the already-selected diagnosis from the search results', () => {
        component.selectedDiagnosis = {
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        };
        dataLayerSpy.list.and.returnValue(
            of([
                { display_name: 'Ovarian carcinoma', id: 'C56.9' },
                { display_name: 'Endometrial carcinoma', id: 'C54.1' },
            ])
        );
        component.searchDiagnosis('carcinoma');
        expect(component.diagnosisOptions).toEqual([
            { name: 'Endometrial carcinoma', code: 'C54.1' },
        ]);
    });

    it('clears diagnosis options and skips the API call when the query is empty', fakeAsync(() => {
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
        ];
        dataLayerSpy.list.calls.reset();
        component.searchQuery = '';
        component.onSearchInput();
        tick(300);
        expect(dataLayerSpy.list).not.toHaveBeenCalled();
        expect(component.diagnosisOptions).toEqual([]);
    }));

    it('debounces rapid search input and only queries with the latest term', fakeAsync(() => {
        dataLayerSpy.list.calls.reset();
        dataLayerSpy.list.and.returnValue(of([]));
        component.searchQuery = 'ov';
        component.onSearchInput();
        tick(100);
        component.searchQuery = 'ova';
        component.onSearchInput();
        tick(300);
        expect(dataLayerSpy.list).toHaveBeenCalledTimes(1);
        expect(dataLayerSpy.list).toHaveBeenCalledWith('ocl-diagnoses', {
            q: 'ova',
        });
    }));

    it('discards a stale response that resolves after a newer search', () => {
        let firstSubscriber!: Subscriber<any>;
        dataLayerSpy.list.and.returnValues(
            new Observable(subscriber => {
                firstSubscriber = subscriber;
            }),
            of([{ display_name: 'Endometrial carcinoma', id: 'C54.1' }])
        );
        component.searchDiagnosis('ov');
        component.searchDiagnosis('end');
        firstSubscriber.next([
            { display_name: 'Ovarian carcinoma', id: 'C56.9' },
        ]);
        expect(component.diagnosisOptions).toEqual([
            { name: 'Endometrial carcinoma', code: 'C54.1' },
        ]);
    });

    it('discards a stale error that resolves after a newer search', () => {
        let firstSubscriber!: Subscriber<any>;
        dataLayerSpy.list.and.returnValues(
            new Observable(subscriber => {
                firstSubscriber = subscriber;
            }),
            of([{ display_name: 'Endometrial carcinoma', id: 'C54.1' }])
        );
        component.searchDiagnosis('ov');
        component.searchDiagnosis('end');
        firstSubscriber.error(new Error('network error'));
        expect(component.diagnosisOptions).toEqual([
            { name: 'Endometrial carcinoma', code: 'C54.1' },
        ]);
    });

    it('surfaces API errors without leaving stale results or a stuck loading state', () => {
        dataLayerSpy.list.and.returnValue(
            throwError(() => new Error('network error'))
        );
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
        ];
        component.searchDiagnosis('ovarian');
        expect(component.diagnosisOptions).toEqual([]);
        expect(component.searching).toBe(false);
    });

    it('clears stale diagnosis options once a diagnosis is selected', () => {
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
        ];
        component.selectDiagnosis({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
        expect(component.diagnosisOptions).toEqual([]);
        expect(component.searchQuery).toBe('');
    });

    it('only keeps a single selected diagnosis, replacing any previous selection', () => {
        component.selectDiagnosis({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
        component.selectDiagnosis({
            name: 'Endometrial carcinoma',
            code: 'C54.1',
        });
        expect(component.selectedDiagnosis).toEqual({
            name: 'Endometrial carcinoma',
            code: 'C54.1',
        });
    });

    it('removes the selected diagnosis', () => {
        component.selectDiagnosis({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
        component.removeDiagnosis();
        expect(component.selectedDiagnosis).toBeNull();
    });

    it('removes the selected diagnosis on backspace when the search box is empty', () => {
        component.selectDiagnosis({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
        component.searchQuery = '';
        component.onSearchKeydown({
            key: 'Backspace',
            preventDefault: () => {},
        } as KeyboardEvent);
        expect(component.selectedDiagnosis).toBeNull();
    });

    it('opens the dropdown and resets the active index', () => {
        component.activeIndex = 2;
        component.openDropdown();
        expect(component.showDropdown).toBe(true);
        expect(component.activeIndex).toBe(-1);
    });

    it('moves the active index down through diagnosis options on ArrowDown', () => {
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
            { name: 'Endometrial carcinoma', code: 'C54.1' },
        ];
        const preventDefault = jasmine.createSpy('preventDefault');
        component.onSearchKeydown({
            key: 'ArrowDown',
            preventDefault,
        } as unknown as KeyboardEvent);
        expect(preventDefault).toHaveBeenCalled();
        expect(component.showDropdown).toBe(true);
        expect(component.activeIndex).toBe(0);
    });

    it('does not move the active index on ArrowDown when there are no options', () => {
        component.diagnosisOptions = [];
        component.onSearchKeydown({
            key: 'ArrowDown',
            preventDefault: () => {},
        } as KeyboardEvent);
        expect(component.activeIndex).toBe(-1);
    });

    it('moves the active index up through diagnosis options on ArrowUp', () => {
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
            { name: 'Endometrial carcinoma', code: 'C54.1' },
        ];
        component.activeIndex = 0;
        const preventDefault = jasmine.createSpy('preventDefault');
        component.onSearchKeydown({
            key: 'ArrowUp',
            preventDefault,
        } as unknown as KeyboardEvent);
        expect(preventDefault).toHaveBeenCalled();
        expect(component.activeIndex).toBe(1);
    });

    it('does not move the active index on ArrowUp when there are no options', () => {
        component.diagnosisOptions = [];
        component.onSearchKeydown({
            key: 'ArrowUp',
            preventDefault: () => {},
        } as KeyboardEvent);
        expect(component.activeIndex).toBe(-1);
    });

    it('selects the active diagnosis option on Enter', () => {
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
        ];
        component.showDropdown = true;
        component.activeIndex = 0;
        const preventDefault = jasmine.createSpy('preventDefault');
        component.onSearchKeydown({
            key: 'Enter',
            preventDefault,
        } as unknown as KeyboardEvent);
        expect(preventDefault).toHaveBeenCalled();
        expect(component.selectedDiagnosis).toEqual({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
    });

    it('does nothing on Enter when the dropdown is closed', () => {
        component.diagnosisOptions = [
            { name: 'Ovarian carcinoma', code: 'C56.9' },
        ];
        component.showDropdown = false;
        component.activeIndex = 0;
        component.onSearchKeydown({
            key: 'Enter',
            preventDefault: () => {},
        } as KeyboardEvent);
        expect(component.selectedDiagnosis).toBeNull();
    });

    it('closes the dropdown on Escape', () => {
        component.showDropdown = true;
        component.activeIndex = 3;
        component.onSearchKeydown({
            key: 'Escape',
            preventDefault: () => {},
        } as KeyboardEvent);
        expect(component.showDropdown).toBe(false);
        expect(component.activeIndex).toBe(-1);
    });

    it('does nothing when a document click fires while the dropdown is closed', () => {
        spyOn(component, 'closeDropdown');
        component.showDropdown = false;
        component.onDocumentClick({
            target: document.body,
        } as unknown as MouseEvent);
        expect(component.closeDropdown).not.toHaveBeenCalled();
    });

    it('closes the dropdown when clicking outside the combo box', () => {
        component.showDropdown = true;
        component.onDocumentClick({
            target: document.createElement('div'),
        } as unknown as MouseEvent);
        expect(component.showDropdown).toBe(false);
        expect(component.activeIndex).toBe(-1);
    });

    it('does not close the dropdown when clicking inside the combo box', () => {
        component.showForm();
        fixture.detectChanges();
        component.showDropdown = true;
        const comboEl = fixture.nativeElement.querySelector('.combo');
        component.onDocumentClick({ target: comboEl } as unknown as MouseEvent);
        expect(component.showDropdown).toBe(true);
    });

    it('clears the date error once a date is confirmed', () => {
        component.errors.date = true;
        component.dateConfirmed = '2026-07-01';
        component.onDateConfirmedChange();
        expect(component.errors.date).toBe(false);
    });

    it('clears the facility error once a facility is entered', () => {
        component.errors.facility = true;
        component.facility = 'Kenyatta National Hospital';
        component.onFacilityInput();
        expect(component.errors.facility).toBe(false);
    });

    it('clears the program error once a programme is chosen', () => {
        component.errors.program = true;
        component.program = 'Chemotherapy programme';
        component.onProgramChange();
        expect(component.errors.program).toBe(false);
    });

    it('clears the enrollment date error once a date is chosen', () => {
        component.errors.enrollDate = true;
        component.enrollDate = '2026-07-02';
        component.onEnrollDateChange();
        expect(component.errors.enrollDate).toBe(false);
    });

    it('warns the user to pick an enrollment option when other fields are valid', () => {
        selectDiagnosisAndBasics();
        component.save();
        expect(component.toasts[0].message).toBe(
            'Select whether the patient has been enrolled for treatment'
        );
        expect(dataLayerSpy.create).not.toHaveBeenCalled();
    });

    it('clears the severity error once a severity is chosen', () => {
        component.errors.severity = true;
        component.severity = 'Mild';
        component.onSeverityChange();
        expect(component.errors.severity).toBe(false);
    });

    it('clears the follow-up fields when switching enrollment to "no"', () => {
        component.onEnrollChange('yes');
        component.errors.facility = true;
        component.onEnrollChange('no');
        expect(component.enrolledChoice).toBe('no');
        expect(component.errors.facility).toBe(false);
    });

    it('does not clear a flagged severity error when switching enrollment choice', () => {
        component.errors.severity = true;
        component.onEnrollChange('no');
        expect(component.errors.severity).toBe(true);
    });

    it('flags missing required fields, including severity, and does not save', () => {
        component.save();
        expect(component.errors.diagnosis).toBe(true);
        expect(component.errors.date).toBe(true);
        expect(component.errors.severity).toBe(true);
        expect(dataLayerSpy.create).not.toHaveBeenCalled();
    });

    it('flags a missing severity even when every other field is filled in', () => {
        component.selectDiagnosis({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
        component.dateConfirmed = '2026-07-01';
        component.onEnrollChange('no');
        component.save();
        expect(component.errors.severity).toBe(true);
        expect(dataLayerSpy.create).not.toHaveBeenCalled();
    });

    it('requires facility, programme and enrollment date when enrolled = yes', () => {
        component.selectDiagnosis({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
        component.dateConfirmed = '2026-07-01';
        component.severity = 'Moderate';
        component.onEnrollChange('yes');
        component.save();
        expect(component.errors.facility).toBe(true);
        expect(component.errors.program).toBe(true);
        expect(component.errors.enrollDate).toBe(true);
        expect(dataLayerSpy.create).not.toHaveBeenCalled();
    });

    it('saves the diagnosis via the API and returns to the list', () => {
        selectDiagnosisAndBasics();
        component.onEnrollChange('no');
        dataLayerSpy.list.calls.reset();
        component.save();
        expect(dataLayerSpy.create).toHaveBeenCalledWith(
            'treatment-enrollment',
            jasmine.objectContaining({
                encounter_id: 'enc-1',
                condition: { code: 'C56.9', display: 'Ovarian carcinoma' },
                date: '2026-07-01',
                severity: 'moderate',
                linked_to_treatment: false,
            })
        );
        expect(component.view).toBe('list');
        expect(component.selectedDiagnosis).toBeNull();
        expect(dataLayerSpy.list).toHaveBeenCalledWith('condition-list', {
            strategy: 'linkage',
            patient_id: 'patient-1',
        });
    });

    it('saves treatment linkage details when enrolled = yes', () => {
        selectDiagnosisAndBasics();
        component.onEnrollChange('yes');
        component.facility = 'Kenyatta National Hospital';
        component.program = 'Chemotherapy programme';
        component.enrollDate = '2026-07-02';
        component.save();
        expect(dataLayerSpy.create).toHaveBeenCalledWith(
            'treatment-enrollment',
            jasmine.objectContaining({
                linked_to_treatment: true,
                treatment_facility: 'Kenyatta National Hospital',
                treatment_program: 'Chemotherapy programme',
                enrollment_date: '2026-07-02',
            })
        );
    });

    it('shows a warning toast and keeps the form open when saving fails', () => {
        dataLayerSpy.create.and.returnValue(
            throwError(() => new Error('network error'))
        );
        component.showForm();
        selectDiagnosisAndBasics();
        component.onEnrollChange('no');
        component.save();
        expect(component.view).toBe('form');
        expect(component.selectedDiagnosis).toEqual({
            name: 'Ovarian carcinoma',
            code: 'C56.9',
        });
    });

    it('shows and auto-dismisses a toast', fakeAsync(() => {
        selectDiagnosisAndBasics();
        component.onEnrollChange('no');
        component.save();
        expect(component.toasts.length).toBe(1);
        tick(3200);
        expect(component.toasts.length).toBe(0);
    }));
});
