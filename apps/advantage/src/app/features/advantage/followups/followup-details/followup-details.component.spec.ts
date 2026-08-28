import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { Transition, StateService, UIRouterGlobals } from '@uirouter/angular';
import { ItemListService } from '../../inventory/add-items/add-item-list.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FollowupDetailsComponent } from './followup-details.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreeningService } from '../../visits/visit-patient-screening/screening.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    update() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    create() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    updateNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    createNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    get() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        });
    }
    list() {
        return of({
            results: [],
        });
    }
    remove() {
        return of({
            id: '1231',
        });
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

const uIRouterGlobalsStub = {
    params: {
        serviceRequestId: 'someId',
    },
};

class StateServiceStub {
    reload() {
        return true;
    }
    includes() {
        return true;
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class ItemListServiceStub {
    private mockItemsList = new BehaviorSubject<Array<any>>([]);
    itemsList$ = this.mockItemsList.asObservable();
    addItem() {
        return true;
    }
    getItems() {
        return of([]);
    }
    removeAll() {
        return true;
    }
    removeById() {
        return true;
    }
    updateItemById() {
        return true;
    }
}

class ScreeningServiceStub {
    getScreeningData() {
        return of({
            data: {
                getEncounterAssociatedResources: {
                    riskAssessment: {},
                    consent: {},
                    __typename: 'EncounterAssociatedResources',
                },
            },
        });
    }
    checkUnauthorizedAccess() {}
    setScreeningStates() {}
    mutationBuilder() {
        return of({
            data: {
                recordConsent: {
                    status: 'active',
                },
            },
        });
    }
}
class ScreeningServiceStubError {
    getScreeningData() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    checkUnauthorizedAccess() {}
    setScreeningStates() {}
    mutationBuilder() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('FollowupDetailsComponent', () => {
    let component: FollowupDetailsComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FollowupDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [CommonModule],
            providers: [
                FollowupDetailsComponent,
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => 1, // represents the bookId
                            },
                        },
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: ItemListService, useClass: ItemListServiceStub },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        component = TestBed.inject(FollowupDetailsComponent);

        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );
        const fixture = TestBed.createComponent(FollowupDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test the fetchReport function', () => {
        spyOn(component, 'fetchReport').and.callThrough();

        component.fetchReport();
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test toggleModal function', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('addNote');
        expect(component.toggleModal).toHaveBeenCalledWith('addNote');
    });

    it('should test submitNote method', () => {
        spyOn(component, 'submitNote').and.callThrough();
        component.submitNote({});
        expect(component.submitNote).toHaveBeenCalled();
    });

    it('should test handleNextDueDateChange method', () => {
        component.nextDueDate = undefined;
        spyOn(component, 'handleNextDueDateChange').and.callThrough();
        component.handleNextDueDateChange({});
        expect(component.handleNextDueDateChange).toHaveBeenCalledWith({});
    });

    it('should test the responseFunction function', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        const data = {
            getTaskByID: {
                id: '73d37941-ba00-43ac-8cdf-489463130684',
                encounterID: 'ad9fed7b-94ea-4268-ac6d-09d2bd80fde7',
                task: '',
                description: '',
                workflow: 'DIAGNOSTICS',
                status: 'completed',
                authoredOn: '2024-05-28T12:32:55Z',
                dueDate: null,
                priority: 'routine',
                attachment: [
                    {
                        title: '',
                        url: ' is not a valid URL',
                    },
                ],
                notes: {
                    text: '',
                },
            },
        };

        component.responseFunction({ data: data });
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should include dueDate when nextDueDate is set', () => {
        const mockModel = {
            returned_results_task: 'Test Reason',
            other_reason: 'Test Notes',
        };
        const status = 'pending';
        const testDate = new Date();

        component.nextDueDate = testDate.toDateString();
        spyOn(component.dataLayer, 'update').and.returnValue(
            of({ status: 'updated successfully' })
        );

        component.updateFollowUpTask(mockModel, status);

        expect(component.dataLayer.update).toHaveBeenCalled();
    });

    it('should not include dueDate when nextDueDate is not set', () => {
        const mockModel = {
            returned_results_task: 'Test Reason',
            other_reason: 'Test Notes',
        };
        const status = 'pending';
        const testDate = undefined;

        component.nextDueDate = testDate;
        spyOn(component.dataLayer, 'update').and.returnValue(
            of({ status: 'updated successfully' })
        );

        component.updateFollowUpTask(mockModel, status);

        expect(component.nextDueDate).toBeUndefined();
        expect(component.dataLayer.update).toHaveBeenCalled();
    });

    it('should include the radio reason when other_reason is not selected', () => {
        const mockModel = {
            returned_results_task: 'Test Reason',
        };
        const status = 'pending';
        const testDate = undefined;

        component.nextDueDate = testDate;
        spyOn(component.dataLayer, 'update').and.returnValue(
            of({ status: 'updated successfully' })
        );

        component.updateFollowUpTask(mockModel, status);

        expect(component.nextDueDate).toBeUndefined();
        expect(component.dataLayer.update).toHaveBeenCalled();
    });

    it('should test setBadgeBackgroundColor function', () => {
        spyOn(component, 'setBadgeBackgroundColor').and.callThrough();

        const result = component.setBadgeBackgroundColor('urgent');
        component.setBadgeBackgroundColor('urgent');
        expect(component.setBadgeBackgroundColor).toHaveBeenCalled();
        expect(result).toBe('#fce7e8');
    });

    it('should test statusStyleMapFn function', () => {
        spyOn(component, 'statusStyleMapFn').and.callThrough();

        const result = component.statusStyleMapFn('card', 'completed');
        component.statusStyleMapFn('card', 'completed');
        expect(component.statusStyleMapFn).toHaveBeenCalled();
        expect(result).toBe('item-card-success');
    });

    it('should test statusStyleMapFn function for default status values', () => {
        spyOn(component, 'statusStyleMapFn').and.callThrough();

        const result = component.statusStyleMapFn('p', '');
        component.statusStyleMapFn('card', '');
        expect(component.statusStyleMapFn).toHaveBeenCalled();
        expect(result).toBe('default-color');
    });

    it('should test setBadgeBackgroundColor function if status is undefined', () => {
        spyOn(component, 'setBadgeBackgroundColor').and.callThrough();

        const result = component.setBadgeBackgroundColor('');
        expect(component.setBadgeBackgroundColor).toHaveBeenCalled();
        expect(result).toBe('#f6f4f9');
    });

    it('should test setBadgeBackgroundColor function if status provided is incorrect', () => {
        spyOn(component, 'setBadgeBackgroundColor').and.callThrough();

        const result = component.setBadgeBackgroundColor('fail risk');
        expect(component.setBadgeBackgroundColor).toHaveBeenCalled();
        expect(result).toBe('#f6f4f9');
    });

    it('should test setBadgeColor function', () => {
        spyOn(component, 'setBadgeColor').and.callThrough();

        const result = component.setBadgeColor('routine');
        component.setBadgeColor('routine');
        expect(component.setBadgeColor).toHaveBeenCalled();
        expect(result).toBe('#a5550b');
    });

    it('should test setBadgeColor function if status is undefined', () => {
        spyOn(component, 'setBadgeColor').and.callThrough();

        const result = component.setBadgeColor('');
        expect(component.setBadgeColor).toHaveBeenCalled();
        expect(result).toBe('#a6a5a8');
    });

    it('should test setBadgeColor function if status provided is incorrect', () => {
        spyOn(component, 'setBadgeColor').and.callThrough();

        const result = component.setBadgeColor('fail risk');
        expect(component.setBadgeColor).toHaveBeenCalled();
        expect(result).toBe('#a6a5a8');
    });

    it('should update the follow-up task', () => {
        const model = {
            returned_results_task: 'Some reason',
            other_reason: 'Some notes',
        };
        const status = 'completed';
        spyOn(component.dataLayer, 'update').and.returnValue(
            of({ status: 'updated successfully' })
        );

        component.updateFollowUpTask(model, status);

        expect(component.dataLayer.update).toHaveBeenCalled();
    });

    it('should update the follow-up task when action is to add note', () => {
        const model = {
            returned_results_task: 'Some reason',
            other_reason: 'Some notes',
        };
        const status = 'addNote';
        spyOn(component.dataLayer, 'update').and.returnValue(
            of({ status: 'updated successfully' })
        );

        // Act
        component.updateFollowUpTask(model, status);

        // Assert
        expect(component.dataLayer.update).toHaveBeenCalled();
    });

    it('should test the responseFunction functionality when errors occur', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        component.responseFunction({
            data: null,
            errors: [
                {
                    message:
                        'cannot create a questionnaire response in a finished encounter',
                    path: ['createQuestionnaireResponse'],
                },
            ],
        });
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test the responseFunction functionality when errors occurs and errors array is undefined', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        component.responseFunction({
            data: null,
        });
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test the responseFunction functionality when no errors occur', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        component.responseFunction({
            data: {
                id: 1,
            },
        });
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test the showToast function', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast(
            'bottom-right',
            'success',
            'Successful',
            'Task has been updated'
        );
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the updateFollowUpTask and resolve error responses', () => {
        const mockModel = {
            other_reason: 'some reason',
            returned_results_task: '123',
        };

        spyOn(component.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('Server error'))
        );
        spyOn(component, 'errorHandlerFxn');

        component.updateFollowUpTask(mockModel, 'cancelled');

        expect(component.dataLayer.update).toHaveBeenCalled();
        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });

    it('should test the ngOnInit function', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should handle error and set loadingDataFetch to false', () => {
        // Arrange
        const error = new Error('Test error');
        spyOn(component, 'errorHandlerFxn').and.callThrough();

        // Act
        component.errorHandlerFxn(error);

        // Assert
        expect(component.errorHandlerFxn).toHaveBeenCalledWith(error);
        expect(component.loadingDataFetch).toBe(false);
    });

    it('should test taskResponseFunctionWithStatus for completed', () => {
        const response = {
            data: {
                id: 1,
            },
        };
        const status = 'completed';

        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fetchReport').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.taskResponseFunctionWithStatus(status)(response);

        expect(component.loading2).toBe(false);
        expect(component.submitted2).toBe(true);
        expect(component.toggleModal).toHaveBeenCalledWith('completeTask');
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Task has been updated'
        );
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test taskResponseFunctionWithStatus for cancelled', () => {
        const response = {
            data: {
                id: 1,
            },
        };
        const status = 'cancelled';

        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fetchReport').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.taskResponseFunctionWithStatus(status)(response);

        expect(component.loading2).toBe(false);
        expect(component.submitted2).toBe(true);
        expect(component.toggleModal).toHaveBeenCalledWith('markUnfulfilled');
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Task has been updated'
        );
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test taskResponseFunctionWithStatus for add Note', () => {
        const response = {
            data: {
                id: 1,
            },
        };
        const status = 'addNote';

        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fetchReport').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.taskResponseFunctionWithStatus(status)(response);

        expect(component.loading2).toBe(false);
        expect(component.submitted2).toBe(true);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Task has been updated'
        );
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test taskResponseFunctionWithStatus for any other status', () => {
        const response = {
            data: {
                id: 1,
            },
        };
        const status = 'otherStatus';

        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fetchReport').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.taskResponseFunctionWithStatus(status)(response);

        expect(component.loading2).toBe(false);
        expect(component.submitted2).toBe(true);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Task has been updated'
        );
        expect(component.fetchReport).toHaveBeenCalled();
    });
});

describe('FollowupDetailsComponent throws error', () => {
    let component: FollowupDetailsComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FollowupDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [CommonModule],
            providers: [
                FollowupDetailsComponent,
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => 1, // represents the bookId
                            },
                        },
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: ItemListService, useClass: ItemListServiceStub },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStubError,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        component = TestBed.inject(FollowupDetailsComponent);

        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );
        const fixture = TestBed.createComponent(FollowupDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should handle error and set loadingDataFetch to false', () => {
        // Arrange
        const error = new Error('Test error');
        spyOn(component, 'errorHandlerFxn').and.callThrough();

        // Act
        component.errorHandlerFxn(error);

        // Assert
        expect(component.errorHandlerFxn).toHaveBeenCalledWith(error);
        expect(component.loading).toBe(false);
    });
});
