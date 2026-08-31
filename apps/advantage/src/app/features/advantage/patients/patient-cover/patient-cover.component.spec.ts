import { PatientService } from '../patient.service';
import { PatientCoverComponent } from './patient-cover.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { SchemeModel } from '../../models';
import { mockPatientData } from '../../appointments/add-appointment/add-appointment.component.spec';

export const mockSchemeData: SchemeModel = {
    id: '448a07d7-a806-4089-9f19-80728adebbea',
    identifiers: [],
    active: true,
    created: '2024-03-21T14:49:01.648306+03:00',
    created_by: '6601d8a2-cee3-4c1e-8192-438cb56ffb13',
    updated: '2024-03-21T14:49:01.648321+03:00',
    updated_by: '6601d8a2-cee3-4c1e-8192-438cb56ffb13',
    name: 'Nano Limited',
    benefit_access: ['DENTAL', 'OPTICAL'],
    identification_mode: ['OTP', 'FINGERPRINT'],
    scheme_code: null,
    valid_from: null,
    valid_to: null,
    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    payer: '4d35bb01-9079-48b5-9939-c78a7abff355',
    network: '45ec492c-3227-4cfa-9dbc-9134a6f2f8f7',
};

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '1' }],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

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
class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class PatientServiceStub {
    addPatientCover(): Observable<any> {
        // Simulate an empty observable since this is a stub
        return new Observable(observer => {
            observer.next({});
            observer.complete();
        });
    }
}

class StateServiceStub {
    reload() {
        return true;
    }
    includes() {
        return true;
    }
}

describe('PatientCoverComponent', () => {
    let component: PatientCoverComponent;
    let fixture: ComponentFixture<PatientCoverComponent>;
    let service;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [PatientCoverComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('age'),
                mockPipe('titleCase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(PatientCoverComponent);
        service = TestBed.inject(PatientService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test callToggleFunction method', () => {
        spyOn(component, 'callToggleFunction').and.callThrough();
        spyOn(component.toggleFunction, 'emit');
        component.callToggleFunction();
        expect(component.toggleFunction.emit).toHaveBeenCalled();
        expect(component.callToggleFunction).toHaveBeenCalled();
    });

    it('should test getFilteredResponse method', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();
        component.getFilteredResponse(mockSchemeData, 'scheme');
        component.getFilteredResponse(mockSchemeData, 'customer');
        expect(component.getFilteredResponse).toHaveBeenCalled();
    });

    it('should test navigateToSchemePage method', () => {
        spyOn(component, 'navigateToSchemePage').and.callThrough();
        component.navigateToSchemePage();
        expect(component.navigateToSchemePage).toHaveBeenCalled();
    });

    it('should test createPatientCover method', () => {
        spyOn(component, 'createPatientCover').and.callThrough();
        spyOn(service, 'addPatientCover').and.callThrough();
        spyOn(component, 'callToggleFunction').and.callThrough();

        component.loading = false;
        component.selectedScheme = mockSchemeData;
        component.memberNumber = 'NH123';
        component.patient = mockPatientData;
        component.validFrom = '2024-01-01';
        component.validTo = '2025-01-01';

        component.createPatientCover();
        service.addPatientCover();
        service.addPatientCover().subscribe({
            next: () => {
                component.callToggleFunction();
            },
        });
        component.refreshAfterAddingCover = true;
        component.createPatientCover();
        expect(component.createPatientCover).toHaveBeenCalled();
        expect(service.addPatientCover).toHaveBeenCalled();
        expect(component.callToggleFunction).toHaveBeenCalled();
    });

    it('should test getValidToDate method', () => {
        spyOn(component, 'getValidToDate').and.callThrough();
        component.getValidToDate('2024-01-01');
        expect(component.getValidToDate).toHaveBeenCalled();
    });

    it('should test getValidFromDate method', () => {
        spyOn(component, 'getValidFromDate').and.callThrough();
        component.getValidFromDate('2024-01-01');
        expect(component.getValidFromDate).toHaveBeenCalled();
    });
});

describe('PatientCoverComponent with model', () => {
    let component: PatientCoverComponent;
    let fixture: ComponentFixture<PatientCoverComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [PatientCoverComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('age'),
                mockPipe('titleCase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(PatientCoverComponent);
        component = fixture.componentInstance;
        component.model = { guarantor: '123123' };
        fixture.detectChanges();
    });

    it('should test getValidFromDate method', () => {
        spyOn(component, 'getValidFromDate').and.callThrough();
        component.model = { guarantor: '123123' };
        component.ngOnInit();
        component.getValidFromDate('2024-01-01');
        expect(component.getValidFromDate).toHaveBeenCalled();
    });
});
