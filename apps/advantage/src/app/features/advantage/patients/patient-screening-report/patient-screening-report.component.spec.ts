import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientScreeningReportComponent } from './patient-screening-report.component';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.screening-report',
    },
    params: {
        cancerType: 'breast',
        encounterId: '3572-1848-0928-1948',
    },
};

class NbToastrServiceStub {
    show() {
        return {};
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
}

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}
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

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            edges: [
                {
                    node: {
                        id: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        task: 'VIA test',
                        description: 'A VIA test',
                        status: 'requested',
                        workflow: 'Cervical Cancer Screening',
                        authoredOn: '2024-05-12T10:39:23+03:00',
                    },
                    cursor: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                },
                {
                    node: {
                        id: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        task: 'VIA test',
                        description: 'A VIA test',
                        status: 'requested',
                        workflow: 'Cervical Cancer Screening',
                        authoredOn: '2024-05-12T10:18:01+03:00',
                    },
                    cursor: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                },
            ],
            pageInfo: {
                HasNextPage: true,
                EndCursor:
                    'AfOl5oX74j2DI0ts-6NcxKSF2jvQ1RaVWj782Ok3miRrzgOx-2oS3G_0XbEnp8MoI5Fk9uJHgTwfA7-O_gz6U7Y9mDJjb5vUFZgGa4tM4kCaotS2m9Z4ciGeUkEEu_fLdiHtcfLsOSS4LQhGBigtaxGQ2yCZXzRinUGW6AKJ4QsNzOQdBHPdpO7VXALqAb0dFr-YmN9sA13dmh_m98XHxl7-pvMy9B0yBkY=',
                HasPreviousPage: false,
                StartCursor: '',
            },
        });
    }
}

describe('PatientScreeningReportComponent', () => {
    let component: PatientScreeningReportComponent;
    let fixture: ComponentFixture<PatientScreeningReportComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientScreeningReportComponent],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(PatientScreeningReportComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';
        component.encounterId = '3572-1848-0928-1948';

        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test getSegments functions', () => {
        spyOn(component, 'getSegments').and.callThrough();
        component.getSegments('8583-2851-8184');
        expect(component.getSegments).toHaveBeenCalled();
    });
});

describe('PatientScreeningReportComponent fails', () => {
    let component: PatientScreeningReportComponent;
    let fixture: ComponentFixture<PatientScreeningReportComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientScreeningReportComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },

                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientScreeningReportComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError(
            () => new Error('Error thrown')
        );
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getFollowUps is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test getSegments functions', () => {
        spyOn(component, 'getSegments').and.callThrough();
        component.getSegments('8583-2851-8184');
        expect(component.getSegments).toHaveBeenCalled();
    });
});
