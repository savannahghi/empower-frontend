import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { VisitCareplanComponent } from './visit-careplan.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbIconLibraries,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbAlertModule,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    ChangeDetectorRef,
} from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { of, throwError, delay } from 'rxjs';
import { NbToastrModule } from '@nebular/theme';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class UIRouterGlobalsStub {
    params = { encounterId: 'test-encounter-id' };
}

class TranslateServiceMock {
    setFallbackLang = jasmine.createSpy('setFallbackLang');
    use = jasmine.createSpy('use');
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {
            return true;
        });
    }
}

class SilStoresServiceStub {
    update = jasmine.createSpy('update').and.returnValue(of({ id: '12' }));
}

class ErrorHandlerServiceStub {
    handleError = jasmine.createSpy('handleError');
}

class MockChangeDetectorRef {
    detectChanges = jasmine.createSpy('detectChanges');
}

class StateServiceStub {
    reset = jasmine.createSpy('reset');
    go = jasmine.createSpy('go');
    includes = jasmine.createSpy('includes').and.returnValue(false);
}

class MockAnalyticsService {
    trackEvent = jasmine.createSpy('trackEvent');
}

const mockCarePlanData = {
    encounterId: 'enc123',
    treatmentPhases: [
        {
            id: 'phase1',
            name: 'Phase 1',
            status: 'ready',
            cycles: [
                { id: 'cycle1a', name: 'Cycle 1A', status: 'ready' },
                { id: 'cycle1b', name: 'Cycle 1B', status: 'pending' },
                { id: 'cycle1c', name: 'Cycle 1C', status: 'pending' },
            ],
        },
        {
            id: 'phase2',
            name: 'Phase 2',
            status: 'pending',
            cycles: [{ id: 'cycle2a', name: 'Cycle 2A', status: 'pending' }],
        },
        {
            id: 'phase3',
            name: 'Phase 3',
            status: 'completed',
            cycles: [{ id: 'cycle3a', name: 'Cycle 3A', status: 'completed' }],
        },
    ],
};

const mockRefreshCarePlan = jasmine.createSpy('refreshCarePlan');

describe('VisitCareplanComponent', () => {
    let component: VisitCareplanComponent;
    let fixture: ComponentFixture<VisitCareplanComponent>;
    let iconLibraries: NbIconLibraries;
    let dataLayer: jasmine.SpyObj<SilStoresService>;
    let errorHandler: jasmine.SpyObj<ErrorHandlerService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                NbThemeModule.forRoot(),
                NbToastrModule.forRoot(),
                NbCardModule,
                NbButtonModule,
                NbIconModule,
                NbInputModule,
                NbSelectModule,
                NbSpinnerModule,
                NbAlertModule,
                VisitCareplanComponent,
            ],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: UIRouterGlobals, useClass: UIRouterGlobalsStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: MockAnalyticsService },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        iconLibraries = TestBed.inject(NbIconLibraries);
        iconLibraries.registerFontPack('eva', {
            packClass: 'eva',
            iconClassPrefix: 'eva',
        });
        iconLibraries.setDefaultPack('eva');

        fixture = TestBed.createComponent(VisitCareplanComponent);
        component = fixture.componentInstance;

        dataLayer = TestBed.inject(
            SilStoresService
        ) as jasmine.SpyObj<SilStoresService>;
        errorHandler = TestBed.inject(
            ErrorHandlerService
        ) as jasmine.SpyObj<ErrorHandlerService>;

        component.carePlanData = mockCarePlanData;
        component.refreshCarePlan = mockRefreshCarePlan;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize protocolSections and call setReadyCycle if carePlanData and treatmentPhases exist', () => {
            expect(component.protocolSections['phase1']).toBeTrue();
            expect(component.protocolSections['phase2']).toBeTrue();
            expect(component.protocolSections['phase3']).toBeTrue();
            expect(component.selectedCycle).toEqual(
                mockCarePlanData.treatmentPhases[0].cycles[0]
            );
            expect(component.selectedPhase).toEqual(
                mockCarePlanData.treatmentPhases[0]
            );
        });

        it('should not initialize protocolSections or call setReadyCycle if carePlanData is null', () => {
            component.carePlanData = null;
            component.protocolSections = {};
            component.selectedCycle = null;
            component.selectedPhase = null;
            component.ngOnInit();
            expect(Object.keys(component.protocolSections).length).toBe(0);
            expect(component.selectedCycle).toBeNull();
            expect(component.selectedPhase).toBeNull();
        });

        it('should not initialize protocolSections or call setReadyCycle if treatmentPhases is empty', () => {
            component.carePlanData = { treatmentPhases: [] };
            component.protocolSections = {};
            component.selectedCycle = null;
            component.selectedPhase = null;
            component.ngOnInit();
            expect(Object.keys(component.protocolSections).length).toBe(0);
            expect(component.selectedCycle).toBeNull();
            expect(component.selectedPhase).toBeNull();
        });

        it('should test the showToast method', () => {
            spyOn(component, 'showToast').and.callThrough();
            component.showToast(
                'bottom-right',
                'success',
                'message',
                'context'
            );
            expect(component.showToast).toHaveBeenCalled();
        });
    });

    describe('toggleProtocolSection', () => {
        it('should toggle a section to false if it was true', () => {
            component.protocolSections = { section1: true };
            component.toggleProtocolSection('section1');
            expect(component.protocolSections['section1']).toBeFalse();
        });

        it('should toggle a section to true if it was false', () => {
            component.protocolSections = { section1: false };
            component.toggleProtocolSection('section1');
            expect(component.protocolSections['section1']).toBeTrue();
        });

        it('should add a new section and set its state to true if it does not exist, then toggle to false', () => {
            component.protocolSections = {};
            component.toggleProtocolSection('newSection');
            expect(component.protocolSections['newSection']).toBeFalse();
            component.toggleProtocolSection('newSection');
            expect(component.protocolSections['newSection']).toBeTrue();
        });
    });

    describe('selectCycle', () => {
        it('should set the selectedCycle and selectedPhase', () => {
            const cycle = { id: 'testCycle', name: 'Test Cycle' };
            const phase = { id: 'testPhase', name: 'Test Phase' };
            component.selectCycle(cycle, phase);
            expect(component.selectedCycle).toEqual(cycle);
            expect(component.selectedPhase).toEqual(phase);
        });
    });

    describe('setReadyCycle', () => {
        it('should select the first ready cycle in a ready phase', () => {
            const data = {
                treatmentPhases: [
                    {
                        id: 'p1',
                        status: 'pending',
                        cycles: [{ id: 'c1', status: 'ready' }],
                    },
                    {
                        id: 'p2',
                        status: 'ready',
                        cycles: [{ id: 'c2', status: 'ready' }],
                    },
                ],
            };
            component.carePlanData = data;
            component.setReadyCycle();
            expect(component.selectedCycle).toEqual(
                data.treatmentPhases[1].cycles[0]
            );
            expect(component.selectedPhase).toEqual(data.treatmentPhases[1]);
        });

        it('should select the first uncompleted cycle in the first ready phase', () => {
            const data = {
                treatmentPhases: [
                    {
                        id: 'p1',
                        status: 'ready',
                        cycles: [
                            { id: 'c1', status: 'completed' },
                            { id: 'c2', status: 'ready' },
                            { id: 'c3', status: 'pending' },
                        ],
                    },
                ],
            };
            component.carePlanData = data;
            component.setReadyCycle();
            expect(component.selectedCycle).toEqual(
                data.treatmentPhases[0].cycles[1]
            );
            expect(component.selectedPhase).toEqual(data.treatmentPhases[0]);
        });

        it('should default to the first cycle of the first phase if no ready cycles/phases are found', () => {
            const data = {
                treatmentPhases: [
                    {
                        id: 'p1',
                        status: 'pending',
                        cycles: [{ id: 'c1', status: 'pending' }],
                    },
                    {
                        id: 'p2',
                        status: 'pending',
                        cycles: [{ id: 'c2', status: 'completed' }],
                    },
                ],
            };
            component.carePlanData = data;
            component.setReadyCycle();
            expect(component.selectedCycle).toEqual(
                data.treatmentPhases[0].cycles[0]
            );
            expect(component.selectedPhase).toEqual(data.treatmentPhases[0]);
        });

        it('should handle empty treatmentPhases gracefully', () => {
            component.carePlanData = { treatmentPhases: [] };
            component.selectedCycle = null;
            component.selectedPhase = null;
            component.setReadyCycle();
            expect(component.selectedCycle).toBeNull();
            expect(component.selectedPhase).toBeNull();
        });

        it('should handle phases with empty cycles array gracefully', () => {
            component.carePlanData = {
                treatmentPhases: [{ id: 'p1', status: 'ready', cycles: [] }],
            };
            component.selectedCycle = null;
            component.selectedPhase = null;
            component.setReadyCycle();
            expect(component.selectedCycle).toBeNull();
            expect(component.selectedPhase).toBeNull();
        });
    });

    describe('isSelectedPhaseCompleted', () => {
        it('should return true if all cycles in the selected phase are completed', () => {
            component.selectedPhase = {
                cycles: [{ status: 'completed' }, { status: 'completed' }],
            };
            expect(component.isSelectedPhaseCompleted()).toBeTrue();
        });

        it('should return false if any cycle in the selected phase is not completed', () => {
            component.selectedPhase = {
                cycles: [{ status: 'completed' }, { status: 'pending' }],
            };
            expect(component.isSelectedPhaseCompleted()).toBeFalse();
        });

        it('should return false if selectedPhase is null', () => {
            component.selectedPhase = null;
            expect(component.isSelectedPhaseCompleted()).toBeFalse();
        });

        it('should return false if selectedPhase has no cycles', () => {
            component.selectedPhase = { cycles: [] };
            expect(component.isSelectedPhaseCompleted()).toBeFalse();
        });

        it('should return false if selectedPhase has undefined cycles', () => {
            component.selectedPhase = { cycles: undefined };
            expect(component.isSelectedPhaseCompleted()).toBeFalse();
        });
    });

    describe('handleAdminister', () => {
        beforeEach(() => {
            (dataLayer.update as jasmine.Spy).calls.reset();
            (errorHandler.handleError as jasmine.Spy).calls.reset();
            mockRefreshCarePlan.calls.reset();

            component.carePlanData = {
                encounterId: 'enc123',
                treatmentPhases: [
                    {
                        id: 'phaseA',
                        name: 'Phase A',
                        status: 'ready',
                        cycles: [
                            {
                                id: 'cycleA1',
                                name: 'Cycle A1',
                                status: 'ready',
                            },
                            {
                                id: 'cycleA2',
                                name: 'Cycle A2',
                                status: 'pending',
                            },
                        ],
                    },
                    {
                        id: 'phaseB',
                        name: 'Phase B',
                        status: 'pending',
                        cycles: [
                            {
                                id: 'cycleB1',
                                name: 'Cycle B1',
                                status: 'pending',
                            },
                        ],
                    },
                ],
            };
            component.selectCycle(
                component.carePlanData.treatmentPhases[0].cycles[0],
                component.carePlanData.treatmentPhases[0]
            );
            component.protocolSections = { phaseA: true, phaseB: false };
            component.loading = {};
            fixture.detectChanges();
        });

        it('should correctly set the loading state during administration', fakeAsync(() => {
            (dataLayer.update as jasmine.Spy).and.returnValue(
                of({}).pipe(delay(0))
            );

            component.handleAdminister();
            expect(component.loading['administer']).toBeTrue();
            tick();
            expect(component.loading['administer']).toBeFalse();
        }));

        it('should call dataLayer.update with correct arguments and update cycle status on success', fakeAsync(() => {
            spyOn(component, 'handleCompleteCarePlanPhase');
            component.handleAdminister();
            tick();
            expect(dataLayer.update).toHaveBeenCalledWith(
                'clinical-task',
                'cycleA1',
                { status: 'completed', updateReason: 'Administered' },
                null,
                true
            );
            expect(
                component.carePlanData.treatmentPhases[0].cycles[0].status
            ).toBe('completed');
            expect(component.handleCompleteCarePlanPhase).toHaveBeenCalled();
        }));

        it('should advance to the next uncompleted cycle in the same phase', fakeAsync(() => {
            component.handleAdminister();
            tick();
            fixture.detectChanges();
            expect(component.selectedCycle.id).toBe('cycleA2');
            expect(component.selectedPhase.id).toBe('phaseA');
        }));

        it('should advance to the next phase if the current phase is completed', fakeAsync(() => {
            component.carePlanData.treatmentPhases[0].cycles = [
                {
                    id: 'cycleA1',
                    name: 'Cycle A1',
                    status: 'ready',
                },
            ];
            component.selectCycle(
                component.carePlanData.treatmentPhases[0].cycles[0],
                component.carePlanData.treatmentPhases[0]
            );
            (dataLayer.update as jasmine.Spy).and.returnValue(of({}));

            component.handleAdminister();
            tick();
            fixture.detectChanges();

            expect(component.selectedCycle.id).toBe('cycleB1');
            expect(component.selectedPhase.id).toBe('phaseB');
            expect(component.protocolSections['phaseA']).toBeFalse();
            expect(component.protocolSections['phaseB']).toBeTrue();
        }));

        it('should invoke refreshCarePlan when available', fakeAsync(() => {
            component.handleAdminister();
            tick();
            expect(mockRefreshCarePlan).toHaveBeenCalledWith('enc123');
        }));

        it('should handle administration errors gracefully', fakeAsync(() => {
            const error = new Error('Administration failed');
            (dataLayer.update as jasmine.Spy).and.returnValue(
                throwError(() => error).pipe(delay(1))
            );
            component.handleAdminister();
            tick();
            expect(component.loading['administer']).toBeFalse();
            expect(errorHandler.handleError).toHaveBeenCalledWith(
                error,
                component
            );
        }));

        it('should call setReadyCycle if no automatic advancement occurs', fakeAsync(() => {
            component.carePlanData = {
                encounterId: 'enc123',
                treatmentPhases: [
                    {
                        id: 'phaseSingle',
                        name: 'Phase Single',
                        status: 'ready',
                        cycles: [
                            {
                                id: 'cycleS1',
                                name: 'Cycle S1',
                                status: 'ready',
                            },
                        ],
                    },
                ],
            };
            component.selectCycle(
                component.carePlanData.treatmentPhases[0].cycles[0],
                component.carePlanData.treatmentPhases[0]
            );
            const setReadyCycleSpy = spyOn(
                component,
                'setReadyCycle'
            ).and.callThrough();

            component.handleAdminister();
            tick();

            expect(setReadyCycleSpy).toHaveBeenCalled();
            expect(component.selectedCycle.id).toBe('cycleS1');
        }));

        it('should select the first cycle of the next phase if all cycles in that phase are completed', fakeAsync(() => {
            component.carePlanData = {
                encounterId: 'enc123',
                treatmentPhases: [
                    {
                        id: 'currentPhase',
                        name: 'Current Phase',
                        status: 'ready',
                        cycles: [
                            {
                                id: 'cycleCurrent',
                                name: 'Cycle Current',
                                status: 'ready',
                            },
                        ],
                    },
                    {
                        id: 'nextPhaseWithAllCompletedCycles',
                        name: 'Next Phase with All Completed Cycles',
                        status: 'pending',
                        cycles: [
                            {
                                id: 'cycleNext1',
                                name: 'Cycle Next 1',
                                status: 'completed',
                            },
                            {
                                id: 'cycleNext2',
                                name: 'Cycle Next 2',
                                status: 'completed',
                            },
                        ],
                    },
                    {
                        id: 'anotherPhase',
                        name: 'Another Phase',
                        status: 'pending',
                        cycles: [
                            {
                                id: 'cycleAnother1',
                                name: 'Cycle Another 1',
                                status: 'pending',
                            },
                        ],
                    },
                ],
            };
            component.selectCycle(
                component.carePlanData.treatmentPhases[0].cycles[0],
                component.carePlanData.treatmentPhases[0]
            );

            (dataLayer.update as jasmine.Spy).and.returnValue(of({}));

            component.handleAdminister();
            tick();
            fixture.detectChanges();

            expect(
                component.carePlanData.treatmentPhases[0].cycles[0].status
            ).toBe('completed');
            expect(component.selectedCycle.id).toBe('cycleNext1');
            expect(component.selectedPhase.id).toBe(
                'nextPhaseWithAllCompletedCycles'
            );
            expect(component.protocolSections['currentPhase']).toBeFalse();
            expect(
                component.protocolSections['nextPhaseWithAllCompletedCycles']
            ).toBeTrue();
        }));

        describe('handleCompleteCarePlanPhase', () => {
            beforeEach(() => {
                (dataLayer.update as jasmine.Spy).calls.reset();
                (errorHandler.handleError as jasmine.Spy).calls.reset();
            });

            const testCases = [
                {
                    description: 'selectedPhase is null',
                    setup: () => {
                        component.selectedPhase = null;
                        component.selectedCycle = { id: 'c1' };
                    },
                },
                {
                    description: 'selectedCycle is null',
                    setup: () => {
                        component.selectedPhase = {
                            id: 'p1',
                            cycles: [{ id: 'c1' }],
                        };
                        component.selectedCycle = null;
                    },
                },
                {
                    description: 'selectedPhase.cycles is not an array',
                    setup: () => {
                        component.selectedPhase = {
                            id: 'p1',
                            cycles: undefined,
                        };
                        component.selectedCycle = { id: 'c1' };
                    },
                },
                {
                    description: 'selectedCycle is not the last cycle',
                    setup: () => {
                        component.selectedPhase = {
                            id: 'p1',
                            cycles: [
                                { id: 'c1', status: 'completed' },
                                { id: 'c2', status: 'completed' },
                            ],
                        };
                        component.selectedCycle = {
                            id: 'c1',
                            status: 'completed',
                        };
                    },
                },
                {
                    description: 'not all cycles are completed',
                    setup: () => {
                        component.selectedPhase = {
                            id: 'p1',
                            cycles: [
                                { id: 'c1', status: 'completed' },
                                { id: 'c2', status: 'pending' },
                            ],
                        };
                        component.selectedCycle = {
                            id: 'c2',
                            status: 'pending',
                        };
                    },
                },
            ];

            testCases.forEach(({ description, setup }) => {
                it(`should do nothing if ${description}`, () => {
                    setup();
                    component.handleCompleteCarePlanPhase();
                    expect(dataLayer.update).not.toHaveBeenCalled();
                });
            });

            it('should call dataLayer.update and set phase status to completed if last cycle and all cycles completed', fakeAsync(() => {
                const cycles = [
                    { id: 'c1', status: 'completed' },
                    { id: 'c2', status: 'completed' },
                ];
                component.selectedPhase = { id: 'p1', status: 'ready', cycles };
                component.selectedCycle = cycles[1];
                (dataLayer.update as jasmine.Spy).and.returnValue(of({}));
                component.handleCompleteCarePlanPhase();
                tick();
                expect(dataLayer.update).toHaveBeenCalledWith(
                    'clinical-task',
                    'p1',
                    { status: 'completed', updateReason: 'Phase completed' },
                    null,
                    true
                );
                expect(component.selectedPhase.status).toBe('completed');
            }));

            it('should call errorHandler.handleError if update fails', fakeAsync(() => {
                const cycles = [
                    { id: 'c1', status: 'completed' },
                    { id: 'c2', status: 'completed' },
                ];
                component.selectedPhase = { id: 'p1', status: 'ready', cycles };
                component.selectedCycle = cycles[1];
                const error = new Error('Update failed');
                (dataLayer.update as jasmine.Spy).and.returnValue(
                    throwError(() => error)
                );
                component.handleCompleteCarePlanPhase();
                tick();
                expect(errorHandler.handleError).toHaveBeenCalledWith(
                    error,
                    component
                );
            }));
        });
    });
});
