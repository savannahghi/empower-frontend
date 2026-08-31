import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ExaminationsListComponent } from './examinations-list.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 'observation-id' };
    }
}

class NbToastrServiceStub {
    warning() {
        return {};
    }
    danger() {
        return {};
    }
}

class ErrorHandlerServiceStub {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleError(error: any, context: any) {}
}

class SilStoresServiceStub {
    list(api: string) {
        if (api === 'observations') {
            return of({
                TotalCount: 2,
                Edges: [
                    {
                        Node: {
                            id: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
                            name: 'HPV Oncoprotein',
                            value: 'Normal',
                            status: 'FINAL',
                            category: 'Exam',
                            patientID: 'christine, happy ',
                            timeRecorded: '2025-06-17T09:16:32Z',
                            usageContext: 'SCREENING_EXAMINATIONS',
                            serviceRequestID: '',
                        },
                        Cursor: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
                    },
                    {
                        Node: {
                            id: '954b60ae-3f0e-439d-8c37-a593fb15287a',
                            name: 'Breast examination (text)',
                            value: 'Normal',
                            status: 'FINAL',
                            category: 'Exam',
                            patientID: 'christine, happy ',
                            timeRecorded: '2025-06-17T09:16:32Z',
                            usageContext: 'SCREENING_EXAMINATIONS',
                            serviceRequestID: '',
                        },
                        Cursor: '954b60ae-3f0e-439d-8c37-a593fb15287a',
                    },
                ],
                PageInfo: {
                    HasNextPage: false,
                    EndCursor: '',
                    HasPreviousPage: false,
                    StartCursor: '',
                },
            });
        }
        return of({ results: [], totalCount: 0 });
    }
}

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('API Error: Boom!'));
        return sub;
    }
}

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

describe('ExaminationsListComponent: ', () => {
    let component: ExaminationsListComponent;
    let fixture: ComponentFixture<ExaminationsListComponent>;
    let toastrService: NbToastrService;
    let dataLayerService: SilStoresService;
    let stateService: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('replaceWith')],
            declarations: [ExaminationsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: UIRouterGlobals,
                    useValue: { current: { name: '' }, params: () => ({}) },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExaminationsListComponent);
        component = fixture.componentInstance;
        toastrService = TestBed.inject(NbToastrService);
        dataLayerService = TestBed.inject(SilStoresService);
        stateService = TestBed.inject(StateService);
        fixture.detectChanges();
    });

    it('should initialize table headers and rows correctly on ngOnInit', () => {
        component.ngOnInit();
        expect(component.tableHeader.length).toBeGreaterThan(0);
        expect(component.rows.length).toBeGreaterThan(0);
        expect(component.filterParams).toEqual({
            use_context: 'SCREENING_EXAMINATIONS',
            _count: 20,
        });
    });

    it('should set filter parameters', () => {
        const testFilters = { status: 'FINAL', patient: '123' };
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter(testFilters);
        expect(component.setFilter).toHaveBeenCalledWith(testFilters);
    });

    it('should test toggleReportDrawer functionality', () => {
        spyOn(component, 'toggleReportDrawer').and.callThrough();
        expect(component.showExaminationReport).toBeFalse();
        component.toggleReportDrawer();
        expect(component.toggleReportDrawer).toHaveBeenCalled();
        expect(component.showExaminationReport).toBeTrue();
        component.examinationReportData = { some: 'data' };
        component.toggleReportDrawer();
        expect(component.showExaminationReport).toBeFalse();
        expect(component.examinationReportData).toBeNull();
    });

    it('should handle missing observation ID in viewReport', () => {
        spyOn(toastrService, 'danger').and.callThrough();
        spyOn(component, 'getObservationDetails').and.callThrough();

        component.viewReport({});

        expect(toastrService.danger).toHaveBeenCalledWith(
            'Cannot view details: Missing observation ID',
            'Error'
        );
        expect(component.getObservationDetails).not.toHaveBeenCalled();
    });

    it('should extract observation ID from node property in viewReport', () => {
        spyOn(component, 'getObservationDetails').and.callThrough();

        component.viewReport({
            node: {
                id: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
                name: 'Direct Examination',
                usageContext: 'BREAST_CANCER',
                patientID: 'patient-456',
                timeRecorded: '2025-07-17T10:16:32Z',
            },
        });

        expect(component.getObservationDetails).toHaveBeenCalledWith(
            'd6e134ed-da4e-42ae-8a44-0640f87afc4d'
        );
    });

    it('should handle empty observation ID in getObservationDetails', () => {
        spyOn(toastrService, 'danger').and.callThrough();
        spyOn(dataLayerService, 'list').and.callThrough();

        component.getObservationDetails('');

        expect(toastrService.danger).toHaveBeenCalledWith(
            'Cannot fetch details: Missing observation ID',
            'Error'
        );
        expect(dataLayerService.list).not.toHaveBeenCalled();

        (toastrService.danger as jasmine.Spy).calls.reset();
        (dataLayerService.list as jasmine.Spy).calls.reset();

        component.getObservationDetails(undefined);

        expect(toastrService.danger).toHaveBeenCalledWith(
            'Cannot fetch details: Missing observation ID',
            'Error'
        );
        expect(dataLayerService.list).not.toHaveBeenCalled();
    });

    it('should navigate to details page on successful response', () => {
        spyOn(sessionStorage, 'setItem').and.callThrough();
        spyOn(stateService, 'go').and.callThrough();

        component.encounter = {
            observationId: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
            examinationType: 'Test Exam',
        };

        component.responseFunction({
            Edges: [
                {
                    Node: {
                        id: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
                        name: 'Test',
                    },
                },
            ],
        });

        expect(sessionStorage.setItem).toHaveBeenCalled();
        expect(stateService.go).toHaveBeenCalledWith(
            'app.advantage.screenings.examinations-details',
            jasmine.objectContaining({
                observationId: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
            }),
            { reload: true }
        );
    });

    it('should handle lowercase response format', () => {
        spyOn(sessionStorage, 'setItem').and.callThrough();
        spyOn(stateService, 'go').and.callThrough();

        component.encounter = {
            observationId: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
        };

        component.responseFunction({
            edges: [
                {
                    node: {
                        id: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
                        name: 'Test',
                    },
                },
            ],
        });

        expect(sessionStorage.setItem).toHaveBeenCalled();
        expect(stateService.go).toHaveBeenCalled();
    });

    it('should handle results array response format', () => {
        spyOn(sessionStorage, 'setItem').and.callThrough();
        spyOn(stateService, 'go').and.callThrough();

        component.encounter = {
            observationId: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
        };

        component.responseFunction({
            results: [
                {
                    id: 'd6e134ed-da4e-42ae-8a44-0640f87afc4d',
                    name: 'Test',
                },
            ],
        });

        expect(sessionStorage.setItem).toHaveBeenCalled();
        expect(stateService.go).toHaveBeenCalled();
    });

    it('should show warning when no observation data found', () => {
        spyOn(toastrService, 'warning').and.callThrough();
        spyOn(sessionStorage, 'setItem').and.callThrough();
        spyOn(stateService, 'go').and.callThrough();

        component.responseFunction({ edges: [], results: [] });

        expect(toastrService.warning).toHaveBeenCalledWith(
            'Examination details not found.',
            'Not Found'
        );
        expect(sessionStorage.setItem).not.toHaveBeenCalled();
        expect(stateService.go).not.toHaveBeenCalled();
    });

    it('should handle viewReport with node property containing observation data', () => {
        const eventData = {
            node: {
                id: 'test-id',
                name: 'Test Examination',
                usageContext: 'CERVICAL_CANCER_SCREENING',
                patientID: 'patient-123',
                timeRecorded: '2025-06-17T09:16:32Z',
            },
        };

        spyOn(component, 'getObservationDetails');

        component.viewReport(eventData);

        expect(component.encounter).toEqual({
            observationId: 'test-id',
            examinationType: 'Test Examination',
            usageContext: 'CERVICAL_CANCER_SCREENING',
            patientId: 'patient-123',
            timeRecorded: '2025-06-17T09:16:32Z',
        });

        expect(component.getObservationDetails).toHaveBeenCalledWith('test-id');
    });

    it('should handle viewReport with direct properties', () => {
        const eventData = {
            node: {
                id: 'direct-id',
                name: 'Direct Examination',
                usageContext: 'BREAST_CANCER',
                patientID: 'patient-456',
                timeRecorded: '2025-07-17T10:16:32Z',
            },
        };

        spyOn(component, 'getObservationDetails');

        component.viewReport(eventData);

        expect(component.encounter).toEqual({
            observationId: 'direct-id',
            examinationType: 'Direct Examination',
            usageContext: 'BREAST_CANCER',
            patientId: 'patient-456',
            timeRecorded: '2025-07-17T10:16:32Z',
        });

        expect(component.getObservationDetails).toHaveBeenCalledWith(
            'direct-id'
        );
    });

    it('should handle getObservationDetails with valid observation ID', () => {
        const observationId = 'valid-id';
        spyOn(component.dataLayer, 'list').and.returnValue(
            of({
                edges: [
                    {
                        node: {
                            id: observationId,
                            name: 'Valid Observation',
                        },
                    },
                ],
            })
        );

        spyOn(component, 'responseFunction');

        component.getObservationDetails(observationId);

        expect(component.dataLayer.list).toHaveBeenCalledWith('observations', {
            id: observationId,
            use_context: 'SCREENING_EXAMINATIONS',
            limit: 1,
        });

        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should handle empty response in responseFunction', () => {
        spyOn(component.toastrService, 'warning');
        spyOn(sessionStorage, 'setItem');
        spyOn(component.$state, 'go');

        component.responseFunction({});

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Examination details not found.',
            'Not Found'
        );
        expect(sessionStorage.setItem).not.toHaveBeenCalled();
        expect(component.$state.go).not.toHaveBeenCalled();

        (component.toastrService.warning as jasmine.Spy).calls.reset();

        component.responseFunction({
            edges: [],
            Edges: [],
            results: [],
        });

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Examination details not found.',
            'Not Found'
        );
    });

    it('should handle null response in responseFunction', () => {
        spyOn(component.toastrService, 'warning');

        component.responseFunction(null);

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Examination details not found.',
            'Not Found'
        );
    });

    it('should handle undefined response in responseFunction', () => {
        spyOn(component.toastrService, 'warning');

        component.responseFunction(undefined);

        expect(component.toastrService.warning).toHaveBeenCalledWith(
            'Examination details not found.',
            'Not Found'
        );
    });

    it('should handle different response formats in ngOnInit', () => {
        spyOn(component.dataLayer, 'list').and.returnValue(of(null));
        component.ngOnInit();
        expect(component.observations).toEqual([]);

        (component.dataLayer.list as jasmine.Spy).and.returnValue(
            of({ edges: [] })
        );
        component.ngOnInit();
        expect(component.observations).toEqual([]);

        const mockData = {
            edges: [{ node: { id: 'test-id' } }],
        };
        (component.dataLayer.list as jasmine.Spy).and.returnValue(of(mockData));
        component.ngOnInit();
        expect(component.observations).toEqual(mockData.edges);
    });

    it('should handle all response formats in responseFunction', () => {
        spyOn(sessionStorage, 'setItem');
        spyOn(component.$state, 'go');
        spyOn(component.toastrService, 'warning');

        component.encounter = {
            observationId: 'test-id',
            examinationType: 'Test Exam',
        };

        component.responseFunction(null);
        expect(component.toastrService.warning).toHaveBeenCalled();
        (component.toastrService.warning as jasmine.Spy).calls.reset();

        component.responseFunction({});
        expect(component.toastrService.warning).toHaveBeenCalled();
        (component.toastrService.warning as jasmine.Spy).calls.reset();

        component.responseFunction({ edges: [], Edges: [], results: [] });
        expect(component.toastrService.warning).toHaveBeenCalled();
        (component.toastrService.warning as jasmine.Spy).calls.reset();

        component.responseFunction({
            edges: [{ node: { id: 'test-id' } }],
        });
        expect(sessionStorage.setItem).toHaveBeenCalled();
        expect(component.$state.go).toHaveBeenCalled();
        (sessionStorage.setItem as jasmine.Spy).calls.reset();
        (component.$state.go as jasmine.Spy).calls.reset();

        component.responseFunction({
            Edges: [{ Node: { id: 'test-id' } }],
        });
        expect(sessionStorage.setItem).toHaveBeenCalled();
        expect(component.$state.go).toHaveBeenCalled();
        (sessionStorage.setItem as jasmine.Spy).calls.reset();
        (component.$state.go as jasmine.Spy).calls.reset();

        component.responseFunction({
            results: [{ id: 'test-id' }],
        });
        expect(sessionStorage.setItem).toHaveBeenCalled();
        expect(component.$state.go).toHaveBeenCalled();
    });

    it('should handle node property in viewReport', () => {
        spyOn(component, 'getObservationDetails');

        const eventWithNode = {
            node: {
                id: 'test-id',
                name: 'Test Examination',
                usageContext: 'CERVICAL_CANCER_SCREENING',
                patientID: 'patient-123',
                timeRecorded: '2025-06-17T09:16:32Z',
            },
        };

        component.viewReport(eventWithNode);

        expect(component.encounter).toEqual({
            observationId: 'test-id',
            examinationType: 'Test Examination',
            usageContext: 'CERVICAL_CANCER_SCREENING',
            patientId: 'patient-123',
            timeRecorded: '2025-06-17T09:16:32Z',
        });

        expect(component.getObservationDetails).toHaveBeenCalledWith('test-id');
    });
});

describe('ExaminationsListComponent error handling', () => {
    let component: ExaminationsListComponent;
    let fixture: ComponentFixture<ExaminationsListComponent>;
    let toastrService: NbToastrService;
    let errorHandler: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('replaceWith')],
            declarations: [ExaminationsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: { current: { name: '' }, params: () => ({}) },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExaminationsListComponent);
        component = fixture.componentInstance;
        toastrService = TestBed.inject(NbToastrService);
        errorHandler = TestBed.inject(ErrorHandlerService);
        fixture.detectChanges();
    });

    it('should handle API errors when fetching observation details', done => {
        const observationEvent = {
            node: {
                id: 'some-id',
            },
        };
        spyOn(errorHandler, 'handleError').and.callThrough();
        spyOn(toastrService, 'danger').and.callThrough();

        component.viewReport(observationEvent);

        fixture.whenStable().then(() => {
            expect(errorHandler.handleError).toHaveBeenCalled();
            expect(toastrService.danger).toHaveBeenCalledWith(
                'Failed to fetch examination details.',
                'Error'
            );
            done();
        });
    });

    it('should handle API errors when fetching observations list on init', () => {
        const errorResponse = new Error('API Error');
        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError(() => errorResponse)
        );
        spyOn(component.errorHandler, 'handleError');

        component.ngOnInit();

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            errorResponse,
            component
        );
        expect(component.loading).toBeFalse();
    });
});
