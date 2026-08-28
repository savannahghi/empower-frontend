import {
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ExaminationsDetailsComponent } from './examinations-details.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { throwError, of } from 'rxjs';
import {
    NbToastrService,
    NbStatusService,
    NbComponentStatus,
    NbThemeModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
} from '@nebular/theme';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, Transition } from '@uirouter/angular';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class NbToastrServiceStub {
    danger() {
        return of(() => {});
    }
    warning() {
        return of(() => {});
    }
    show() {
        return of(() => {});
    }
}

class TransitionServiceStub {
    from() {
        return { name: 'previous.state', params: {} };
    }
    params() {
        return {
            observationId: 'obs-123',
            examinationType: 'Breast Examination',
            timeRecorded: '2023-07-15T10:30:00Z',
            patientId: 'patient-123',
        };
    }
}

class SilStoresServiceStub {
    list(api: string, params: any) {
        if (api === 'observations') {
            if (params && params.id === 'results-format-id') {
                return of({
                    results: [
                        {
                            id: 'results-format-id',
                            name: 'Blood Pressure',
                            status: 'final',
                            value: 'Normal',
                            category: 'Exam',
                            patientID: 'patient-123',
                            timeRecorded: '2023-07-15T10:30:00Z',
                        },
                    ],
                });
            } else if (params && params.id === 'empty-response-id') {
                return of({
                    edges: [],
                    results: [],
                });
            } else {
                return of({
                    edges: [
                        {
                            Node: {
                                id: 'obs-123',
                                name: 'Breast Examination',
                                status: 'final',
                                value: 'Normal',
                                category: 'Exam',
                                patientID: 'patient-123',
                                timeRecorded: '2023-07-15T10:30:00Z',
                                performer: 'Dr. Smith',
                                notes: 'No abnormalities detected',
                                components: [
                                    {
                                        name: 'Left Breast',
                                        value: 'Normal',
                                        interpretation:
                                            'No masses or abnormalities',
                                    },
                                ],
                            },
                        },
                    ],
                });
            }
        }
        return of({ results: [], totalCount: 0 });
    }
    update() {
        return of({
            id: 'obs-123',
            value: 'Abnormal',
            status: 'final',
        });
    }
    remove() {
        return of({});
    }
}

class SilStoresServiceStubError {
    list() {
        return throwError(() => new Error('API Error'));
    }
    update() {
        return throwError(() => new Error('Update Error'));
    }
    remove() {
        return throwError(() => new Error('Delete Error'));
    }
}

class StateServiceStub {
    go() {
        return true;
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return true;
    }
}

class NbStatusServiceStub {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isCustomStatus(status: NbComponentStatus): boolean {
        return false;
    }
}

describe('ExaminationsDetailsComponent', () => {
    let component: ExaminationsDetailsComponent;
    let fixture: ComponentFixture<ExaminationsDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                NbThemeModule.forRoot({ name: 'default' }),
                NbCardModule,
                NbButtonModule,
                NbIconModule,
                NbSpinnerModule,
                ExaminationsDetailsComponent,
            ],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: FormBuilder, useValue: new FormBuilder() },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExaminationsDetailsComponent);
        component = fixture.componentInstance;

        component.editExaminationForm = new FormBuilder().group({
            selectedResult: [null],
        });

        component.observationId = 'obs-123';
        component.examinationType = 'Breast Examination';
        component.timeRecorded = '2023-07-15T10:30:00Z';
        component.patientId = 'patient-123';

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with route parameters', () => {
        expect(component.observationId).toBe('obs-123');
        expect(component.examinationType).toBe('Breast Examination');
        expect(component.timeRecorded).toBe('2023-07-15T10:30:00Z');
        expect(component.patientId).toBe('patient-123');
    });

    it('should test ngOnInit and call fetchExaminationDetails when observationId is available', () => {
        component.observationData = null;
        component.observationId = 'obs-123';

        spyOn(component, 'fetchExaminationDetails').and.callThrough();
        spyOn(component, 'getResultOptionsForExamination').and.callThrough();

        component.ngOnInit();

        expect(component.getResultOptionsForExamination).toHaveBeenCalled();
        expect(component.fetchExaminationDetails).toHaveBeenCalled();
    });

    it('should test ngOnInit and call processExaminationData when observationData is available', () => {
        const mockData = {
            id: 'obs-123',
            name: 'Breast Examination',
            value: 'Normal',
        };
        component.observationData = mockData;

        spyOn(component, 'processExaminationData').and.callThrough();
        spyOn(component, 'fetchExaminationDetails');

        component.ngOnInit();

        expect(component.processExaminationData).toHaveBeenCalledWith(mockData);
        expect(component.fetchExaminationDetails).not.toHaveBeenCalled();
    });

    it('should test ngOnInit and show error when no observationId or observationData', () => {
        component.observationData = null;
        component.observationId = null;

        spyOn(component.toastrService, 'danger');

        component.ngOnInit();

        expect(component.toastrService.danger).toHaveBeenCalledWith(
            'Missing required examination information',
            'Error'
        );
    });

    it('should test fetchExaminationDetails and process data successfully', fakeAsync(() => {
        spyOn(component, 'processExaminationData').and.callThrough();

        component.fetchExaminationDetails();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.processExaminationData).toHaveBeenCalled();
    }));

    it('should process examination data from results array format', fakeAsync(() => {
        component.observationId = 'results-format-id';

        spyOn(component, 'processExaminationData').and.callThrough();

        component.fetchExaminationDetails();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.processExaminationData).toHaveBeenCalled();
        expect(component.examinationDetails.name).toBe('Blood Pressure');
    }));

    it('should show warning when no examination details found', fakeAsync(() => {
        component.observationId = 'empty-response-id';

        spyOn(component.toastrService, 'warning').and.callThrough();

        component.fetchExaminationDetails();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Examination details not found.',
            'Not Found'
        );
    }));

    it('should test processExaminationData and correctly set examination details', () => {
        const mockData = {
            id: 'obs-123',
            name: 'Breast Examination',
            status: 'final',
            value: 'Normal',
            category: 'Exam',
            patientID: 'patient-123',
            timeRecorded: '2023-07-15T10:30:00Z',
            performer: 'Dr. Smith',
            notes: 'No abnormalities detected',
            components: [
                {
                    name: 'Left Breast',
                    value: 'Normal',
                    interpretation: 'No masses or abnormalities',
                },
            ],
        };

        spyOn(component, 'extractFindings').and.callThrough();

        component.processExaminationData(mockData);

        expect(component.extractFindings).toHaveBeenCalled();
        expect(component.examinationDetails.id).toBe('obs-123');
        expect(component.examinationDetails.name).toBe('Breast Examination');
        expect(component.examinationDetails.value).toBe('Normal');
        expect(component.examinationDetails.patientId).toBe('patient-123');
    });

    it('should test extractFindings and correctly extract component findings', () => {
        const mockData = {
            components: [
                {
                    name: 'Left Breast',
                    value: 'Normal',
                    interpretation: 'No masses or abnormalities',
                },
                {
                    name: 'Right Breast',
                    value: 'Normal',
                    interpretation: 'No masses or abnormalities',
                },
            ],
        };

        const findings = component.extractFindings(mockData);

        expect(findings.length).toBe(2);
        expect(findings[0].name).toBe('Left Breast');
        expect(findings[1].name).toBe('Right Breast');
    });

    it('should test extractFindings and create general finding when no components but interpretation exists', () => {
        const mockData = {
            value: 'Normal',
            interpretation: 'No abnormalities detected',
        };

        const findings = component.extractFindings(mockData);

        expect(findings.length).toBe(1);
        expect(findings[0].name).toBe('General finding');
        expect(findings[0].value).toBe('Normal');
        expect(findings[0].interpretation).toBe('No abnormalities detected');
    });

    it('should test navigateBack with previous state', () => {
        component.previousState = {
            name: 'previous.state',
            params: { id: '123' },
        };

        spyOn(component.$state, 'go');

        component.navigateBack();

        expect(component.$state.go).toHaveBeenCalledWith('previous.state', {
            id: '123',
        });
    });

    it('should test navigateBack without previous state', () => {
        component.previousState = null;

        spyOn(component.$state, 'go');

        component.navigateBack();

        expect(component.$state.go).toHaveBeenCalledWith(
            'app.advantage.screenings.list'
        );
    });

    it('should test formatDate with valid date', () => {
        const date = '2023-07-15T10:30:00Z';

        const formattedDate = component.formatDate(date);

        expect(formattedDate).not.toBe('N/A');
    });

    it('should test formatDate with invalid date', () => {
        const formattedDate = component.formatDate(null);

        expect(formattedDate).toBe('N/A');
    });

    it('should test toggleModal to show and hide modal', () => {
        component.toggle = {};

        component.toggleModal('editExamination');
        expect(component.toggle['editExamination']).toBeTrue();

        component.toggleModal('editExamination');
        expect(component.toggle['editExamination']).toBeFalse();
    });

    it('should reset form and preview result when closing edit modal', () => {
        component.toggle = { editExamination: true };
        component.previewResult = 'Normal';

        spyOn(component.editExaminationForm, 'reset');

        component.toggleModal('editExamination');

        expect(component.toggle['editExamination']).toBeFalse();
        expect(component.editExaminationForm.reset).toHaveBeenCalled();
        expect(component.previewResult).toBeNull();
    });

    it('should test setSelectedExamination and open edit modal', () => {
        const examination = {
            id: 'obs-123',
            name: 'Breast Examination',
            value: 'Normal',
        };
        component.resultOptions = [
            { title: 'Normal', value: 'Normal' },
            { title: 'Abnormal', value: 'Abnormal' },
        ];

        spyOn(component, 'toggleModal');
        spyOn(component.editExaminationForm, 'patchValue');

        component.setSelectedExamination(examination);

        expect(component.selectedExamination).toBe(examination);
        expect(component.editExaminationForm.patchValue).toHaveBeenCalledWith({
            selectedResult: 'Normal',
        });
        expect(component.toggleModal).toHaveBeenCalledWith('editExamination');
    });

    it('should test confirmDeleteExamination and open delete modal', () => {
        const examination = {
            id: 'obs-123',
            name: 'Breast Examination',
        };

        spyOn(component, 'toggleModal');

        component.confirmDeleteExamination(examination);

        expect(component.selectedExamination).toBe(examination);
        expect(component.toggleModal).toHaveBeenCalledWith('deleteExamination');
    });

    it('should test deleteExamination successfully', fakeAsync(() => {
        component.selectedExamination = {
            id: 'obs-123',
            name: 'Breast Examination',
        };

        spyOn(component, 'toggleModal');
        spyOn(component, 'showToast');
        spyOn(component, 'navigateBack');

        component.deleteExamination();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.toggleModal).toHaveBeenCalledWith('deleteExamination');
        expect(component.showToast).toHaveBeenCalledWith(
            'top-right',
            'success',
            'Examination deleted successfully',
            'Deleted'
        );
        expect(component.navigateBack).toHaveBeenCalled();
    }));

    it('should test deleteExamination with no selected examination', () => {
        component.selectedExamination = null;

        spyOn(component.toastrService, 'danger');

        component.deleteExamination();

        expect(component.toastrService.danger).toHaveBeenCalledWith(
            'No examination selected for deletion',
            'Error'
        );
    });

    it('should test onResultChange with valid event', () => {
        const event = { value: 'Abnormal' };

        component.onResultChange(event);

        expect(component.previewResult).toBe('Abnormal');
    });

    it('should test onResultChange with invalid event', () => {
        const event = {};

        component.previewResult = 'Normal';
        component.onResultChange(event);

        expect(component.previewResult).toBe('Normal');
    });

    it('should test updateExaminationResult successfully', fakeAsync(() => {
        component.selectedExamination = {
            id: 'obs-123',
            name: 'Breast Examination',
        };
        component.editExaminationForm.setValue({ selectedResult: 'Abnormal' });

        spyOn(component, 'toggleModal');
        spyOn(component, 'showToast');

        component.updateExaminationResult();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.toggleModal).toHaveBeenCalledWith('editExamination');
        expect(component.showToast).toHaveBeenCalledWith(
            'top-right',
            'success',
            'Examination result updated successfully',
            'Updated'
        );
        expect(component.examinationDetails.value).toBe('Abnormal');
        expect(component.examinationDetails.status).toBe('final');
    }));

    it('should test updateExaminationResult with no selected result', () => {
        component.selectedExamination = {
            id: 'obs-123',
            name: 'Breast Examination',
        };
        component.editExaminationForm.setValue({ selectedResult: null });

        spyOn(component.toastrService, 'warning');

        component.updateExaminationResult();

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Please select a valid result',
            'Warning'
        );
    });

    it('should test getResultOptionsForExamination for breast examination', () => {
        const options = component.getResultOptionsForExamination(
            'breast_cancer_screening'
        );

        expect(options.length).toBe(8);
        expect(options.some(o => o.value === 'Nipple Inversion')).toBeTrue();
    });

    it('should test getResultOptionsForExamination for cervical examination', () => {
        const options = component.getResultOptionsForExamination(
            'cervical_cancer_screening'
        );

        expect(options.length).toBe(3);
    });

    it('should test getResultOptionsForExamination for prostate examination', () => {
        const options = component.getResultOptionsForExamination(
            'prostate_cancer_screening'
        );

        expect(options.length).toBe(2);
    });

    it('should test getResultOptionsForExamination for unknown examination', () => {
        const options = component.getResultOptionsForExamination(
            'Unknown Examination'
        );

        expect(options.length).toBe(2);
        expect(options[0].value).toBe('Normal');
        expect(options[1].value).toBe('Abnormal');
    });

    it('should test getBadgeStyle for normal result', () => {
        const style = component.getBadgeStyle('Normal');

        expect(style.backgroundColor).toBe('#83AE0426');
        expect(style.color).toBe('#83AE04');
    });

    it('should test getBadgeStyle for negative result', () => {
        const style = component.getBadgeStyle('Negative');

        expect(style.backgroundColor).toBe('#83AE0426');
        expect(style.color).toBe('#83AE04');
    });

    it('should test getBadgeStyle for abnormal result', () => {
        const style = component.getBadgeStyle('Abnormal');

        expect(style.backgroundColor).toBe('#DA0A1526');
        expect(style.color).toBe('#DA0A15');
    });

    it('should test getBadgeStyle for positive result', () => {
        const style = component.getBadgeStyle('Positive');

        expect(style.backgroundColor).toBe('#DA0A1526');
        expect(style.color).toBe('#DA0A15');
    });

    it('should test getBadgeStyle for suspicious result', () => {
        const style = component.getBadgeStyle('Suspicious for cancer');

        expect(style.backgroundColor).toBe('#FCF7E8');
        expect(style.color).toBe('#9E7C15');
    });

    it('should test getBadgeStyle for other result', () => {
        const style = component.getBadgeStyle('Other');

        expect(style.backgroundColor).toBe('#0095ff26');
        expect(style.color).toBe('#0095ff');
    });

    it('should test getBadgeStyle with null or undefined value', () => {
        const emptyStyle = component.getBadgeStyle(null);

        expect(emptyStyle).toEqual({});
    });

    it('should test showToast method', () => {
        spyOn(component.toastrService, 'show');

        component.showToast('top-right', 'success', 'Test message', 'Test');

        expect(component.toastrService.show).toHaveBeenCalledWith(
            'Test successfully',
            'Test message',
            jasmine.objectContaining({
                status: 'success',
                duration: component.toastTime,
            })
        );
    });

    it('should process examination data with missing id and name', () => {
        const mockData = {
            status: 'final',
            value: 'Normal',
            category: 'Exam',
        };

        component.observationId = 'fallback-id';
        component.examinationType = 'fallback-name';

        component.processExaminationData(mockData);

        expect(component.examinationDetails.id).toBe('fallback-id');
        expect(component.examinationDetails.name).toBe('fallback-name');
    });

    it('should extract findings with components having missing properties', () => {
        const mockData = {
            components: [{}],
        };

        const findings = component.extractFindings(mockData);

        expect(findings.length).toBe(1);
        expect(findings[0].name).toBe('Unnamed finding');
        expect(findings[0].value).toBe('Not specified');
        expect(findings[0].interpretation).toBe('Not specified');
    });

    it('should extract general finding with missing value', () => {
        const mockData = {
            interpretation: 'Some interpretation',
        };

        const findings = component.extractFindings(mockData);

        expect(findings.length).toBe(1);
        expect(findings[0].name).toBe('General finding');
        expect(findings[0].value).toBe('Not specified');
    });

    it('should show warning when specific examination not found in edges', fakeAsync(() => {
        const customResponse = {
            edges: [
                {
                    Node: {
                        id: 'different-id',
                        name: 'Some Examination',
                    },
                },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(of(customResponse));
        spyOn(component.toastrService, 'warning');

        component.observationId = 'obs-123';
        component.fetchExaminationDetails();
        tick();

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Specific examination not found.',
            'Not Found'
        );
    }));

    it('should show warning when specific examination not found in results', fakeAsync(() => {
        const customResponse = {
            results: [
                {
                    id: 'different-id',
                    name: 'Some Examination',
                },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(of(customResponse));
        spyOn(component.toastrService, 'warning');

        component.observationId = 'obs-123';
        component.fetchExaminationDetails();
        tick();

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Specific examination not found.',
            'Not Found'
        );
    }));

    it('should set default value when data.value is missing', () => {
        const mockData = {
            id: 'obs-123',
            name: 'Breast Examination',
            status: 'final',
            category: 'Exam',
            patientID: 'patient-123',
            timeRecorded: '2023-07-15T10:30:00Z',
            performer: 'Dr. Smith',
            notes: 'No abnormalities detected',
        };

        component.processExaminationData(mockData);

        expect(component.examinationDetails.value).toBe('Not specified');
    });

    it('should set performer correctly in processExaminationData', () => {
        const mockDataWithPerformer = {
            id: 'obs-123',
            name: 'Breast Examination',
            status: 'final',
            value: 'Normal',
            category: 'Exam',
            patientID: 'patient-123',
            timeRecorded: '2023-07-15T10:30:00Z',
            performer: 'Dr. Jane Doe',
            notes: 'No abnormalities detected',
        };

        component.processExaminationData(mockDataWithPerformer);

        expect(component.examinationDetails.performer).toBe('Dr. Jane Doe');
    });

    it('should set performer to null when not provided in data', () => {
        const mockDataWithoutPerformer = {
            id: 'obs-123',
            name: 'Breast Examination',
            status: 'final',
            value: 'Normal',
            category: 'Exam',
            patientID: 'patient-123',
            timeRecorded: '2023-07-15T10:30:00Z',
            notes: 'No abnormalities detected',
        };

        component.processExaminationData(mockDataWithoutPerformer);

        expect(component.examinationDetails.performer).toBeNull();
    });
});

describe('ExaminationsDetailsComponent with API errors', () => {
    let component: ExaminationsDetailsComponent;
    let fixture: ComponentFixture<ExaminationsDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                NbThemeModule.forRoot({ name: 'default' }),
                NbCardModule,
                NbButtonModule,
                NbIconModule,
                NbSpinnerModule,
                ExaminationsDetailsComponent,
            ],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: FormBuilder, useValue: new FormBuilder() },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExaminationsDetailsComponent);
        component = fixture.componentInstance;

        component.editExaminationForm = new FormBuilder().group({
            selectedResult: [null],
        });

        fixture.detectChanges();
    });

    it('should handle error in fetchExaminationDetails', fakeAsync(() => {
        spyOn(component.errorHandler, 'handleError');
        spyOn(component.toastrService, 'danger');

        component.fetchExaminationDetails();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.errorHandler.handleError).toHaveBeenCalled();
        expect(component.toastrService.danger).toHaveBeenCalledWith(
            'Failed to fetch examination details.',
            'Error'
        );
    }));

    it('should handle error in updateExaminationResult', fakeAsync(() => {
        component.selectedExamination = {
            id: 'obs-123',
            name: 'Breast Examination',
        };
        component.editExaminationForm.setValue({ selectedResult: 'Abnormal' });

        const toaterServiceSpy = spyOn(
            component.toastrService,
            'danger'
        ).and.callThrough();

        component.updateExaminationResult();
        tick();

        expect(component.loading).toBeFalse();
        expect(toaterServiceSpy).toHaveBeenCalledWith(
            'Failed to update examination result.',
            'Error'
        );
    }));

    it('should handle error in deleteExamination', fakeAsync(() => {
        component.selectedExamination = {
            id: 'obs-123',
            name: 'Breast Examination',
        };

        spyOn(component.errorHandler, 'handleError');
        spyOn(component.toastrService, 'danger');

        component.deleteExamination();
        tick();

        expect(component.loading).toBeFalse();
        expect(component.errorHandler.handleError).toHaveBeenCalled();
        expect(component.toastrService.danger).toHaveBeenCalledWith(
            'Failed to delete examination.',
            'Error'
        );
    }));
});
