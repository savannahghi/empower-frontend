import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    NbGlobalPhysicalPosition,
    NbStatusService,
    NbToastrService,
} from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ScreeningSummaryComponent } from './screening-summary.component';
import { VisitService } from '../../../visits/visit.service';
import { ScreeningService } from '../../../visits/visit-patient-screening/screening.service';
import { AnalyticsService } from '../../../../../@core/utils';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';

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

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

class NbStatusServiceStub {
    isCustomStatus() {}
}
class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reload() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    params: {
        serviceRequestId: 'someId',
    },
};

class ErrorHandlerServiceStub {
    handleError() {}
}

const mockQuestionnaireResponse = [
    {
        group: 'Patient Information',
        questions: [
            {
                answer: 'Yes',
                childQuestions: [],
                question: 'Have you been screened before?',
            },
        ],
    },
];

class SilStoresServiceStub {
    create() {
        return of([]);
    }

    get(storeName, id) {
        if (storeName === 'questionnaire-response' && id) {
            return of(mockQuestionnaireResponse);
        }
        return of([]);
    }
}

class SilStoresServiceErrorStub {
    get() {
        return throwError(() => new Error('API Error'));
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }

    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }

    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }

    getToken() {
        return {
            access_token: 'token',
        };
    }

    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
        };
    }

    getUserClinicalIds() {
        return {
            clinical_facility_id: 'mock_facility_id',
            clinical_org_id: 'mock_org_id',
        };
    }
}

describe('ScreeningSummaryComponent', () => {
    let component: ScreeningSummaryComponent;
    let fixture: ComponentFixture<ScreeningSummaryComponent>;
    let dataLayerService: SilStoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [ScreeningSummaryComponent, mockPipe('phoneNumberPipe')],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: ScreeningService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );

        fixture = TestBed.createComponent(ScreeningSummaryComponent);
        component = fixture.componentInstance;
        dataLayerService = TestBed.inject(SilStoresService);
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(component, 'fetchQuestionnaireResponses');

        component.ngOnInit();

        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.fetchQuestionnaireResponses).toHaveBeenCalled();
    });

    it('should test fetchQuestionnaireResponses with valid questionnaireID', () => {
        component.questionnaireID = '123';

        const getSpy = spyOn(component.dataLayer, 'get').and.returnValue(
            of(mockQuestionnaireResponse)
        );

        component.fetchQuestionnaireResponses();

        expect(getSpy).toHaveBeenCalledWith('questionnaire-response', '123');

        expect(component.loading).toBeFalse();
        expect(component.questionnaireResponses).toEqual(
            mockQuestionnaireResponse
        );
    });

    it('should not call dataLayer.get when questionnaireID is not provided', () => {
        spyOn(dataLayerService, 'get').and.callThrough();

        component.questionnaireID = undefined;
        component.fetchQuestionnaireResponses();

        expect(dataLayerService.get).not.toHaveBeenCalled();
    });

    it('should handle error in fetchQuestionnaireResponses', () => {
        const errorComponent = new ScreeningSummaryComponent(
            new SilStoresServiceErrorStub() as any,
            uIRouterGlobalsStub as any,
            new NbToastrServiceStub() as any,
            new ErrorHandlerServiceStub() as any
        );

        spyOn(errorComponent.errorHandler, 'handleError');

        errorComponent.questionnaireID = '123';
        errorComponent.fetchQuestionnaireResponses();

        expect(errorComponent.errorHandler.handleError).toHaveBeenCalled();
        expect(errorComponent.loading).toBeFalse();
    });

    it('should test showToastError function', () => {
        spyOn(component.toastrService, 'show');

        component.showToastError('bottom-right', 'danger', 'Error', 'Error');

        expect(component.toastrService.show).toHaveBeenCalledWith(
            'Error',
            'Error',
            {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger',
                duration: 7000,
            }
        );
    });

    it('should set questionnaireResponses and loading state on successful API response', () => {
        component.questionnaireID = '123';
        component.loading = true;

        spyOn(component.dataLayer, 'get').and.returnValue(
            of(mockQuestionnaireResponse)
        );

        component.fetchQuestionnaireResponses();
        expect(component.dataLayer.get).toHaveBeenCalledWith(
            'questionnaire-response',
            '123'
        );
        expect(component.questionnaireResponses).toEqual(
            mockQuestionnaireResponse
        );
        expect(component.loading).toBeFalse();
    });

    it('should handle error and set loading to false when API call fails', () => {
        component.questionnaireID = '123';
        component.loading = true;
        const testError = new Error('API Error');

        spyOn(component.dataLayer, 'get').and.returnValue(
            throwError(() => testError)
        );
        spyOn(component.errorHandler, 'handleError');

        component.fetchQuestionnaireResponses();

        expect(component.dataLayer.get).toHaveBeenCalledWith(
            'questionnaire-response',
            '123'
        );
        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            testError,
            component
        );
        expect(component.loading).toBeFalse();
    });

    it('should not make API call when questionnaireID is not provided', () => {
        component.questionnaireID = undefined;

        spyOn(component.dataLayer, 'get');

        component.fetchQuestionnaireResponses();

        expect(component.dataLayer.get).not.toHaveBeenCalled();
    });
});
