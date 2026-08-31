import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ClinicalRecordsService } from './clinical-records.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: false,
            },
        ];
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            edges: [
                {
                    node: {
                        value: 12,
                        id: 123,
                    },
                },
            ],
        });
    }
    list() {
        return of([]);
    }
    get() {
        return of({});
    }
    update() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('ClinicalRecordsService', () => {
    let service: ClinicalRecordsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            providers: [
                ClinicalRecordsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(ClinicalRecordsService);
    });
    it('should test calculateBMILocal', fakeAsync(() => {
        service.activeServiceRequest = { encounter_id: 1 };
        service.patient = {
            id: 1,
            person: { gender: 'MALE' },
            vitals_reference_ranges: {
                BMI: [
                    { display: 'Display', end: 16, start: 10 },
                    { display: 'Display', end: 40, start: 17 },
                ],
                PULSE_RATE: [{ display: 'Display', end: 16, start: 1 }],
                RESPIRATION_RATE: [{ display: 'Display', end: 16, start: 1 }],
                SPO2: [{ display: 'Display', end: 16, start: 1 }],
                DIASTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                SYSTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                TEMPERATURE: [{ display: 'display name', end: 16, start: 1 }],
                MUAC: [{ display: 'display name', end: 16, start: 1 }],
            },
        };
        service.refetchClinicalIds();
        service.saveBMIRes(23);
        service.updateBMIRes(32);
        const result = {
            id: 1,
            value: 10,
        };

        service.setPatient(service.patient, service.activeServiceRequest);
        service.showToastError('bottom-right', 'danger', 'message', 'title');
        service.getBMIVitalReference(result.value);
        service.height = 150;
        service.weight = 100;
        service.result = {
            id: '123',
            value: 10,
            timeRecorded: '12:00',
        };
        service.calculateBMILocal();
        service.height = 250;
        service.weight = 90;
        service.calculateBMILocal();
        service.result = {
            id: '123',
            value: undefined,
            timeRecorded: '12:00',
        };
        service.calculateBMIData();
        service.getBMIVitalReference(service.result);
        service.calculateBMILocal();
        service.result = {
            id: '123',
            value: 20,
            timeRecorded: '12:00',
        };
        service.height = 110;
        service.weight = 100;
        service.getBMIVitalReference(service.result.value);
        service.handleError({ message: '1221' });
        spyOn(service, 'calculateBMIData').and.returnValue('10');
        service.calculateBMILocal();
        service.getBMIRes('123');
        tick(1000);
        expect(service).toBeTruthy();
    }));

    it('should test setHeight and setWeight', fakeAsync(() => {
        const result = {
            id: 1,
            value: 10,
        };
        const edit = {
            isEditing: false,
        };
        const editTrue = {
            isEditing: true,
        };
        service.setPatient(service.patient, service.activeServiceRequest);
        service.showToastError('bottom-right', 'danger', 'message', 'title');
        service.getBMIVitalReference(result.value);
        service.setHeight(result, 'height', '23123', edit);
        service.setHeight(result, 'height', '23123', editTrue);
        service.setHeight(result, 'weight', '23123', edit);
        service.setHeight(result, 'weight', '23123', editTrue);
        service.setWeight(result, 'height', '23123', edit);
        service.setWeight(result, 'height', '23123', editTrue);
        service.setWeight(result, 'weight', '23123', edit);
        service.setWeight(result, 'weight', '23123', editTrue);
        tick(1000);
        expect(service).toBeTruthy();
    }));

    it('should test handleBMIRes', () => {
        const mockRes = {
            totalCount: 1,
            edges: [
                {
                    node: {
                        id: '123',
                        value: 30,
                        timeRecorded: '2025-07-22T11:51:25Z',
                    },
                },
            ],
        };

        spyOn(service, 'getBMIVitalReference');
        service.handleBMIRes(mockRes);
        expect(service.getBMIVitalReference).toHaveBeenCalledWith(
            mockRes.edges[0].node.value
        );
        expect(service.result.value).toEqual(mockRes.edges[0].node.value);
        expect(service.result.id).toEqual(mockRes.edges[0].node.id);
        expect(service.loadingResult).toBeFalse();
    });

    it('should test updateBMIRes on success', () => {
        const mockResponse = {
            id: 123,
            value: '34',
            timeRecorded: '2025-07-22T11:51:25Z',
        };
        spyOn(service.dataLayer, 'update').and.returnValue(of(mockResponse));
        spyOn(service, 'getBMIVitalReference');
        service.updateBMIRes(20);
        expect(service.loadingResult).toBeFalse();
        expect(service.getBMIVitalReference).toHaveBeenCalledWith(
            mockResponse.value
        );
    });

    it('should test updateBMIRes on dataLayer observable error', () => {
        spyOn(service.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('Error'))
        );
        spyOn(service, 'handleError');
        service.updateBMIRes(20);
        expect(service.loadingResult).toBeFalse();
        expect(service.handleError).toHaveBeenCalled();
    });

    it('should test saveBMIRes on dataLayer observable error', () => {
        service.activeServiceRequest = { encounter_id: 1 };
        spyOn(service.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('Error'))
        );
        spyOn(service, 'handleError');
        service.saveBMIRes(20);
        expect(service.loadingResult).toBeFalse();
        expect(service.handleError).toHaveBeenCalled();
    });
});
