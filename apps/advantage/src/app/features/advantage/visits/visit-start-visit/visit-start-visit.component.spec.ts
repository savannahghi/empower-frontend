import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { FeatureFlagService } from '../../../../@core/utils/feature.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientModel } from '../../models';
import { mockSchemeData } from '../../patients/patient-cover/patient-cover.component.spec';
import { PatientService } from '../../patients/patient.service';
import { StartVisitComponent } from './visit-start-visit.component';

const mockPatientData: PatientModel = {
    id: '3587e159-6e94-4d5a-901f-85b27eda27a3',
    patient_id: 'OREGON_10203',
    file_number: 10203,
    customer_id: '44e75b30-946d-420e-831e-c8ec786b836a',
    person: {
        id: '44e75b30-946d-420e-831e-c8ec786b8361',
        first_name: 'John',
        gender: 'MALE',
        last_name: 'Doe',
        segment: {
            id: '844f7fcd-8731-4728-b7ee-809973ef9c1e',
            name: 'Cervical Cancer General Tips',
            label: 'CERVICAL_CANCER_TIPS',
            description: 'Gives general tips for cervical cancer',
            attributes: null,
            messages: [],
        },
        person_contacts: [
            {
                contact_type: 'phone_number',
                contact: '+254712345678',
                is_primary_contact: true,
            },
        ],
        person_photos: [],
        person_ids: [],
    },
};

const mockQueueData = {
    id: '6609a08c-3d8b-4a92-9052-4240f225ad7d',
    active_visits: ['41fe75a7-3a7f-4c83-b134-f6c31a08568b'],
    workstation_id: 'a205494d-28f2-413a-875c-5b4008153b2e',
    department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
    branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
    cluster_id: null,
    active: true,
    created: '2023-04-21T10:28:18.514374+03:00',
    created_by: '5428a587-527c-40e2-a3da-77a3600b3489',
    updated: '2024-03-22T02:45:46.392577+03:00',
    updated_by: '5428a587-527c-40e2-a3da-77a3600b3489',
    name: 'Billing',
    queue_type: 'BILLING',
    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    practitioner: null,
    schedule: null,
};

const mockGuarantor = {
    id: '467a0c72-7e73-417c-9c94-c092d0f69c04',
    partner_name: 'Zawadi',
};

const mockPatientCoverData = {
    id: '13df7fc2-38ce-4342-91df-caaad8a118c8',
    patient_name: 'Alexa Kantai',
    workstation_id: '6139fe15-895b-478f-8811-1b29eedfb238',
    department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
    branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
    cluster_id: 'd1bfd667-4839-4851-b923-655dc9d2165f',
    active: true,
    created: '2024-03-21T12:04:27.947436+03:00',
    created_by: 'a4e46572-a65c-4c5f-a060-510c969496a5',
    updated: '2024-03-21T12:04:27.947489+03:00',
    updated_by: 'a4e46572-a65c-4c5f-a060-510c969496a5',
    scheme_name: 'Savannah Informatics',
    scheme_id: '33d77e75-a502-4ad6-8c63-fdcd4ec00d33',
    payer_id: '467a0c72-7e73-417c-9c94-c092d0f69c04',
    member_number: 'NH123',
    valid_from: '2024-04-01',
    valid_to: '2024-12-07',
    is_principal: false,
    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    patient: '3587e159-6e94-4d5a-901f-85b27eda27a3',
};

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '1' }],
        });
    }

    listNested() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '1' }],
        });
    }

    get() {
        return of(mockSchemeData);
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
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
    startVisit() {
        return null;
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class FeatureFlagServiceStub {
    private variant: string = 'default';
    featuresLoaded: boolean = true;
    flagsLoadedEmitter = {
        subscribe: jasmine.createSpy('subscribe'),
    };

    checkVariantFlag(flagName: string): boolean {
        if (flagName === 'prov_visitType') {
            return true;
        }

        if (flagName === 'prov_biometricsEnrollmentSidebarLink') {
            return true;
        }
        return false;
    }

    getForcedValue(flagName: string): boolean | string {
        if (flagName === 'prov_enableBenefitServiceInStartVisit') {
            return true;
        }
        if (flagName === 'prov_showRecordPastVisitCheckbox') {
            return 'accessafya;empower;default';
        }
        return false;
    }

    growthbook = {
        getAttributes: () => ({
            variant: this.variant,
        }),
    };

    setVariant(variant: string) {
        this.variant = variant;
    }
}

describe('StartVisitComponent', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);
        fixture.detectChanges();
    });

    // Queue case
    it('should set selectedQueue when item is queue', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();

        component.getFilteredResponse(mockQueueData, 'queue');

        expect(component.selectedQueue).toEqual(mockQueueData);
        expect(component.getFilteredResponse).toHaveBeenCalledWith(
            mockQueueData,
            'queue'
        );
    });

    // Guarantor case
    it('should set selectedGuarantor and guarantorName when item is guarantor', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();

        component.getFilteredResponse(mockGuarantor, 'guarantor');

        expect(component.selectedGuarantor).toEqual(mockGuarantor.id);
        expect(component.guarantorName).toEqual(mockGuarantor.partner_name);
        expect(component.getFilteredResponse).toHaveBeenCalledWith(
            mockGuarantor,
            'guarantor'
        );
    });

    // Guarantor undefined case
    it('should not update selectedGuarantor when item is guarantor and event is undefined', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();

        const previousGuarantor = component.selectedGuarantor;

        component.getFilteredResponse(undefined, 'guarantor');

        expect(component.selectedGuarantor).toEqual(previousGuarantor);
        expect(component.getFilteredResponse).toHaveBeenCalledWith(
            undefined,
            'guarantor'
        );
    });

    // Patientcover case
    it('should set selectedPatientCover and call updateSelectedSchemeId when item is patientcover', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();
        spyOn(component, 'updateSelectedSchemeId').and.callThrough();

        component.getFilteredResponse(mockPatientCoverData, 'patientcover');

        expect(component.selectedPatientCover).toEqual(mockPatientCoverData);
        expect(component.updateSelectedSchemeId).toHaveBeenCalledWith(
            mockPatientCoverData.scheme_id
        );
        expect(component.getFilteredResponse).toHaveBeenCalledWith(
            mockPatientCoverData,
            'patientcover'
        );
    });

    // updateSelectedSchemeId case
    it('should update selectedSchemeId, call fetchScheme, detect changes, and resetSelectedSchemeItem', () => {
        spyOn(component, 'fetchScheme').and.stub();
        spyOn(component, 'resetSelectedSchemeItem').and.stub();
        spyOn(fixture, 'detectChanges').and.stub();

        component.updateSelectedSchemeId('schemeX');

        expect(component.selectedSchemeId).toEqual('schemeX');
        expect(component.fetchScheme).toHaveBeenCalledWith('schemeX');
        expect(component.resetSelectedSchemeItem).toHaveBeenCalled();
    });

    it('should test changeGuarantorType', () => {
        spyOn(component, 'changeGuarantorType').and.callThrough();
        component.changeGuarantorType('INSURANCE');
        component.getPatientBenefits();
        expect(component.changeGuarantorType).toHaveBeenCalled();
    });

    it('should call getPatientBenefits after 2000ms in ngOnInit', fakeAsync(() => {
        const spy = spyOn(component, 'getPatientBenefits');
        component.ngOnInit();

        tick(2000);
        expect(spy).toHaveBeenCalled();

        fixture.destroy();
    }));

    it('should test selectedBillingClass setter', () => {
        const originalSelectedBillingClass = component.selectedBillingClass;
        component.selectedBillingClass = 'CREDIT';
        expect(component.selectedBillingClass).toBe('CREDIT');
        component.selectedBillingClass = originalSelectedBillingClass;
    });

    it('should test isButtonDisabled with loading set to true', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();

        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CASH';
        component.loading = true;
        component.selectedGuarantorType = 'INSURANCE';

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled with loading set to true - selectedGuarantorType is insurance', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CASH';
        component.loading = true;

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled with no selectedQueue and no selectedBillingClass', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();

        component.selectedQueue = undefined;
        component.selectedBillingClass = undefined;

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled for CREDIT as selectedBillingClass and INSURANCE as selectedGuarantorType and valid selectedGuarantor', () => {
        environment.displayFeature = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = mockGuarantor.id;
        component.selectedPatientCover = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should test isButtonDisabled for CREDIT as selectedBillingClass and INSURANCE as selectedGuarantorType', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();
        environment.displayFeature = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = undefined;
        component.selectedPatientCover = undefined;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should test isButtonDisabled for CREDIT as selectedBillingClass and INSURANCE as selectedGuarantorType and valid selectedGuarantor', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();
        environment.displayFeature = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = mockGuarantor.id;
        component.selectedPatientCover = undefined;

        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should return true if selectedBillingClass is not defined', () => {
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return true if feature flag is not enabled and selectedBillingClass is CREDIT and selectedPatientCover is not defined', () => {
        component.displayFeatureInTesting = 'false';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = undefined;
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = '467a0c72-7e73-417c-9c94-c092d0f69c04';
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should return true if feature flag is not enabled and selectedBillingClass is CREDIT and selectedGuarantorType is INSURANCE and selectedGuarantor is not defined', () => {
        component.displayFeatureInTesting = 'false';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return true if feature flag is not enabled and selectedBillingClass is CREDIT and selectedGuarantorType is EMPLOYER and selectedGuarantor is not defined', () => {
        component.displayFeatureInTesting = 'false';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'EMPLOYER';
        component.selectedGuarantor = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return true if feature flag is not enabled and selectedBillingClass is CREDIT and selectedGuarantorType is PATIENT and selectedGuarantor is not defined', () => {
        component.displayFeatureInTesting = 'false';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'PATIENT';
        component.selectedGuarantor = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return true if feature flag is enabled and selectedBillingClass is CREDIT and selectedGuarantorType is INSURANCE and selectedGuarantor is not defined', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = undefined;
        component.loading = false;
        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return true if feature flag is enabled and selectedBillingClass is CREDIT and selectedGuarantorType is EMPLOYER and selectedGuarantor is not defined', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'EMPLOYER';
        component.selectedGuarantor = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return true if feature flag is enabled and selectedBillingClass is CREDIT and selectedGuarantorType is PATIENT and selectedGuarantor is not defined', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'PATIENT';
        component.selectedGuarantor = undefined;
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return false if feature flag is enabled and selectedBillingClass is CREDIT and selectedGuarantorType is INSURANCE, and with both selectedPatientCover & selectedGuarantor as defined', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = {
            id: '1',
            patient_name: 'Test',
            workstation_id: '1',
            department_id: '1',
            branch_id: '1',
            cluster_id: '1',
            active: true,
            created: '24/06/2025',
            created_by: 'user123',
            updated: '01/06/2025',
            updated_by: 'user123',
            scheme_name: 'Test scheme',
            scheme_id: 'scheme1',
            payer_id: 'payer1',
            member_number: 'no1',
            valid_from: '24/09/2025',
            valid_to: '01/01/2026',
            is_principal: true,
            organisation: 'org1',
            patient: 'patient1',
        };
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = 'Test';
        component.loading = false;
        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should return false if feature flag is enabled and selectedBillingClass is CREDIT and selectedGuarantorType is EMPLOYER, and with both selectedPatientCover & selectedGuarantor as defined', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = {
            id: '1',
            patient_name: 'Test',
            workstation_id: '1',
            department_id: '1',
            branch_id: '1',
            cluster_id: '1',
            active: true,
            created: '24/06/2025',
            created_by: 'user123',
            updated: '01/06/2025',
            updated_by: 'user123',
            scheme_name: 'Test scheme',
            scheme_id: 'scheme1',
            payer_id: 'payer1',
            member_number: 'no1',
            valid_from: '24/09/2025',
            valid_to: '01/01/2026',
            is_principal: true,
            organisation: 'org1',
            patient: 'patient1',
        };
        component.selectedGuarantorType = 'EMPLOYER';
        component.selectedGuarantor = 'Test';
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should return true if feature flag is enabled and selectedBillingClass is CREDIT and selectedGuarantorType is PATIENT, and with both selectedPatientCover & selectedGuarantor as defined', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = {
            id: '1',
            patient_name: 'Test',
            workstation_id: '1',
            department_id: '1',
            branch_id: '1',
            cluster_id: '1',
            active: true,
            created: '24/06/2025',
            created_by: 'user123',
            updated: '01/06/2025',
            updated_by: 'user123',
            scheme_name: 'Test scheme',
            scheme_id: 'scheme1',
            payer_id: 'payer1',
            member_number: 'no1',
            valid_from: '24/09/2025',
            valid_to: '01/01/2026',
            is_principal: true,
            organisation: 'org1',
            patient: 'patient1',
        };
        component.selectedGuarantorType = 'PATIENT';
        component.selectedGuarantor = 'Test';
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should return true if loading is true', () => {
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CASH';
        component.loading = true;

        const result = component.isButtonDisabled();

        expect(result).toBe(true);
    });

    it('should return false if all conditions are met', () => {
        component.displayFeatureInTesting = 'true';
        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedPatientCover = mockPatientCoverData;
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = '467a0c72-7e73-417c-9c94-c092d0f69c04';
        component.loading = false;

        const result = component.isButtonDisabled();

        expect(result).toBe(false);
    });

    it('should test isButtonDisabled for CREDIT as selectedBillingClass and EMPLOYER as selectedGuarantorType', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();

        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'EMPLOYER';
        component.selectedGuarantor = undefined;
        component.selectedPatientCover = undefined;

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled for CREDIT as selectedBillingClass and EMPLOYER as selectedGuarantorType and valid selectedGuarantor', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();

        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'EMPLOYER';
        component.selectedGuarantor = mockGuarantor.id;
        component.selectedPatientCover = undefined;

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled for CREDIT as selectedBillingClass and PATIENT as selectedGuarantorType', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();

        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'PATIENT';
        component.selectedGuarantor = undefined;

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled for CASH as selectedBillingClass', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();

        component.selectedQueue = mockQueueData;
        component.selectedBillingClass = 'CASH';

        component.isButtonDisabled();

        expect(component.isButtonDisabled).toHaveBeenCalled();
    });

    it('should test isButtonDisabled when a selectedGuarantor type is available without a selectedGuarantor', () => {
        spyOn(component, 'isButtonDisabled').and.callThrough();
        component.selectedGuarantorType = 'INSURANCE';
        component.selectedGuarantor = '';
        component.selectedQueue = 'Dr Test';
        const isButtonDisabled = component.isButtonDisabled();
        expect(component.isButtonDisabled).toHaveBeenCalled();
        expect(isButtonDisabled).toBeTrue();
    });

    it('should test startVisit method', () => {
        const date = '2015-01-01T00:00:00';

        spyOn(component, 'togglePastVisit').and.callThrough();
        component.togglePastVisit(true);
        expect(component.togglePastVisit).toHaveBeenCalled();

        spyOn(component, 'getStartDate').and.callThrough();
        component.getStartDate(date);
        expect(component.getStartDate).toHaveBeenCalled();

        spyOn(component, 'startVisit').and.callThrough();
        component.startVisit();
        expect(component.startVisit).toHaveBeenCalled();
    });

    it('should test toggleModal', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('patientCoverModal');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should call errorHandler.handleError with the error when the API call fails', () => {
        spyOn(component.visitPatientObservable, 'subscribe').and.callFake(
            (_, error) => {
                error('API Error');
            }
        );
        spyOn(component.errorHandler, 'handleError');
        component.getPatientDetails();

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            'API Error',
            component
        );
    });

    it('should test fetchScheme', () => {
        spyOn(component, 'fetchScheme').and.callThrough();
        spyOn(component.dataLayer, 'get').and.callThrough();

        component.fetchScheme('448a07d7-a806-4089-9f19-80728adebbea');
        expect(component.fetchScheme).toHaveBeenCalled();
    });

    it('should test receiveScheme', () => {
        spyOn(component, 'receiveScheme').and.callThrough();

        component.receiveScheme(mockSchemeData);
        expect(component.receiveScheme).toHaveBeenCalled();
    });

    it('should test changePatientBenefit', () => {
        spyOn(component, 'changePatientBenefit').and.callThrough();

        component.changePatientBenefit('benefitID');
        expect(component.changePatientBenefit).toHaveBeenCalled();
    });

    it('should test resetSelectedSchemeItem', () => {
        spyOn(component, 'resetSelectedSchemeItem').and.callThrough();

        component.resetSelectedSchemeItem();
        expect(component.resetSelectedSchemeItem).toHaveBeenCalled();
    });

    it('should test syncPatientDetailToClinical function', () => {
        spyOn(component, 'syncPatientDetailToClinical').and.callThrough();
        component.syncPatientDetailToClinical();
        expect(component.syncPatientDetailToClinical).toHaveBeenCalled();
    });

    it('should filter out SELF and PATIENT guarantor type for accessafya variant', () => {
        const originalVariant = environment.variant;

        environment.variant = 'accessafya';
        component['initializeFilteredGuarantorOptions']();
        expect(
            component.filteredGuarantorTypeOptions.some(
                opt => opt.value === 'SELF'
            )
        ).toBeFalse();
        expect(
            component.filteredGuarantorTypeOptions.some(
                opt => opt.value === 'PATIENT'
            )
        ).toBeFalse();

        environment.variant = 'default';
        component['initializeFilteredGuarantorOptions']();
        expect(
            component.filteredGuarantorTypeOptions.some(
                opt => opt.value === 'SELF'
            )
        ).toBeTrue();
        expect(
            component.filteredGuarantorTypeOptions.some(
                opt => opt.value === 'PATIENT'
            )
        ).toBeTrue();

        environment.variant = originalVariant;
    });

    it('should set selectedVisitTypeOptions for Empower variant when isEmpowerVariant is true', () => {
        component.isEmpowerVariant = true;
        component.selectedVisitType = undefined;

        component.ngOnInit();

        expect(component.selectedVisitTypeOptions).toEqual([
            { value: 'CHEMO', label: 'Chemotherapy' },
            { value: 'RADIO', label: 'Radiotherapy' },
            { value: 'SURG', label: 'Surgery' },
        ]);
    });

    it('should not set selectedVisitTypeOptions when isEmpowerVariant is false', () => {
        component.isEmpowerVariant = false;
        component.selectedVisitType = undefined;
        component.selectedVisitTypeOptions = undefined;

        component.ngOnInit();

        expect(component.selectedVisitTypeOptions).toBeUndefined();
    });

    it('should set selectedVisitType when changeVisitType is called', () => {
        component.selectedVisitType = undefined;
        component.changeVisitType('IMP');
        expect(component.selectedVisitType).toBe('IMP');
    });

    it('should overwrite selectedVisitType if already set', () => {
        component.selectedVisitType = 'AMB';
        component.changeVisitType('VR');
        expect(component.selectedVisitType).toBe('VR');
    });

    it('should always set selectedBillingClass to "CASH" in ngOnInit', () => {
        component.ngOnInit();

        expect(component.selectedBillingClass).toBe('CASH');
    });

    it('should always call getPatientDetails in ngOnInit', () => {
        spyOn(component, 'getPatientDetails').and.callThrough();
        component.onViewBenefits(1);
        component.selectedPayerIndex = 1;
        component.onViewBenefits(1);
        component.ngOnInit();
        component.handlePatientBenefits({});
        component.handleErrorFxn({});
        expect(component.getPatientDetails).toHaveBeenCalled();
    });

    it('should set formConfig with checkExpressionOn as modelChange in ngOnInit', () => {
        component.ngOnInit();

        expect(component.formConfig).toEqual({
            checkExpressionOn: 'modelChange',
        });
    });

    it('should set max to current moment in ngOnInit', () => {
        component.ngOnInit();

        expect(component.max).toBeDefined();
    });

    it('should set selectedAppointment from uiglobals params in ngOnInit', () => {
        const mockAppointment = { id: '12345', date: '2024-01-01' };
        component.uiglobals.params.appointment = mockAppointment;

        component.ngOnInit();

        expect(component.selectedAppointment).toBe(mockAppointment);
    });

    it('should set selectedGuarantorType to first option value when variant is accessafya and billingClass is CREDIT', () => {
        const originalVariant = environment.variant;
        environment.variant = 'accessafya';
        component['initializeFilteredGuarantorOptions']();
        component.filteredGuarantorTypeOptions = [
            { label: 'Insurance', value: 'INSURANCE' },
        ];
        component.selectedBillingClass = 'CREDIT';
        expect(component.selectedBillingClass).toBe('CREDIT');
        expect(component.selectedGuarantorType).toBe('INSURANCE');
        environment.variant = originalVariant;
    });

    it('should set selectedGuarantorType to undefined if no options and variant is accessafya and billingClass is CREDIT', () => {
        const originalVariant = environment.variant;
        environment.variant = 'accessafya';
        component['initializeFilteredGuarantorOptions']();
        component.filteredGuarantorTypeOptions = [];
        component.selectedBillingClass = 'CREDIT';
        expect(component.selectedBillingClass).toBe('CREDIT');
        expect(component.selectedGuarantorType).toBeUndefined();
        environment.variant = originalVariant;
    });

    it('should set selectedGuarantorType to SELF for non-accessafya variant', () => {
        const originalVariant = environment.variant;
        environment.variant = 'default';
        component.selectedBillingClass = 'CREDIT';
        expect(component.selectedBillingClass).toBe('CREDIT');
        expect(component.selectedGuarantorType).toBe('SELF');
        environment.variant = originalVariant;
    });

    it('should test handleFingerprintAuthResponse function when matched is true', () => {
        const response = {
            matched: true,
            score: 173.1950982822188,
            match_log_id: 'cb497bc7-09b0-445d-a32c-d1457deeb0e7',
        };

        spyOn(component, 'handleFingerprintAuthResponse').and.callThrough();
        component.handleFingerprintAuthResponse(response);
        expect(component.handleFingerprintAuthResponse).toHaveBeenCalledWith(
            response
        );
    });

    it('should test authenticateFingerprint function when globalHealthId is not present', () => {
        component.globalHealthId = undefined;
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test authenticateFingerprint function when globalHealthId is present', () => {
        component.globalHealthId = '4580030000000551';
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test selectFinger function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'selectFinger').and.callThrough();
        component.selectFinger(finger);
        expect(component.selectFinger).toHaveBeenCalledWith(finger);
    });

    it('should not proceed with selectFinger if authenticatedFinger is set', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = 'Right Thumb';
        component.showSpinner = false;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not proceed with selectFinger if showSpinner is true', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = null;
        component.showSpinner = true;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should test isFingerSelected function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'isFingerSelected').and.callThrough();
        component.isFingerSelected(finger);
        expect(component.isFingerSelected).toHaveBeenCalledWith(finger);
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CASH', () => {
        component.selectedBillingClass = 'CASH';
        component['updateStartVisitButtonVisibility']();
        expect(component.showStartVisitButton).toBeTrue();

        const result = component.shouldShowStartVisitButton();
        expect(result).toBeTrue();
    });

    it('should test ShowStartVisitButton property and return true if billing class is CREDIT', () => {
        component.selectedBillingClass = 'CREDIT';
        component.selectedGuarantorType = 'INSURANCE';
        expect(component.showStartVisitButton).toBeTrue();
    });

    describe('shouldShowStartVisitButton with CREDIT, no guarantor, and feature flag enabled', () => {
        it('should return true for INSURANCE guarantor type', () => {
            component.selectedBillingClass = 'CREDIT';
            component.selectedGuarantor = undefined;
            spyOn(component['flagService'], 'getForcedValue').and.returnValue(
                true
            );
            component.selectedGuarantorType = 'INSURANCE';

            const result = component.shouldShowStartVisitButton();

            expect(result).toBeTrue();
        });

        it('should return true for EMPLOYER guarantor type', () => {
            component.selectedBillingClass = 'CREDIT';
            component.selectedGuarantor = undefined;
            spyOn(component['flagService'], 'getForcedValue').and.returnValue(
                true
            );
            component.selectedGuarantorType = 'EMPLOYER';

            const result = component.shouldShowStartVisitButton();

            expect(result).toBeTrue();
        });

        it('should return true for PATIENT guarantor type', () => {
            component.selectedBillingClass = 'CREDIT';
            component.selectedGuarantor = undefined;
            spyOn(component['flagService'], 'getForcedValue').and.returnValue(
                true
            );
            component.selectedGuarantorType = 'PATIENT';

            const result = component.shouldShowStartVisitButton();

            expect(result).toBeTrue();
        });
    });

    it('should test shouldShowStartVisitButton method and return false if none of the conditions are met', () => {
        spyOn(component['flagService'], 'getForcedValue').and.returnValue(
            false
        );

        component.isSupported = true;
        component.deviceWorkstationID = 'ABC123';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = true;
        component.hasError = false;
        component.selectedGuarantor = 'some-guarantor-id';
        component.selectedGuarantorType = 'SELF';
        component.selectedBillingClass = 'CREDIT';

        const result = component.shouldShowStartVisitButton();
        expect(result).toBeFalse();
        expect(component.showStartVisitButton).toBeFalse();
    });

    it('should update showStartVisitButton when selectedBillingClass changes', () => {
        component.selectedBillingClass = 'CASH';
        expect(component.showStartVisitButton).toBeTrue();
        component.isSupported = true;
        component.deviceWorkstationID = 'ABC123';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = true;
        component.hasError = false;
        component.selectedGuarantor = 'some-guarantor-id';
        component.selectedGuarantorType = 'SELF';

        component.selectedBillingClass = 'CREDIT';
        expect(component.showStartVisitButton).toBeFalse();
    });

    it('should test cached property behavior for filteredGuarantorTypeOptions', () => {
        component['initializeFilteredGuarantorOptions']();
        const initialOptions = component.filteredGuarantorTypeOptions;
        expect(component.filteredGuarantorTypeOptions).toBe(initialOptions);
        expect(component.filteredGuarantorTypeOptions).toBeDefined();
        expect(
            Array.isArray(component.filteredGuarantorTypeOptions)
        ).toBeTrue();
    });

    it('should call initializeFilteredGuarantorOptions in ngOnInit', () => {
        spyOn(
            component as any,
            'initializeFilteredGuarantorOptions'
        ).and.callThrough();

        component.ngOnInit();

        expect(
            component['initializeFilteredGuarantorOptions']
        ).toHaveBeenCalled();
        expect(component.filteredGuarantorTypeOptions).toBeDefined();
    });

    it('should test updateStartVisitButtonVisibility method', () => {
        spyOn(
            component as any,
            'updateStartVisitButtonVisibility'
        ).and.callThrough();

        component['updateStartVisitButtonVisibility']();

        expect(
            component['updateStartVisitButtonVisibility']
        ).toHaveBeenCalled();
    });

    it('should return true if billing class is CREDIT, patient exists, but no globalHealthId: our test', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.isSupported = true;
        component.deviceWorkstationID = 'some-id';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;
        component.hasFetchEnrolledError = true;
        expect(component.shouldShowStartVisitButton()).toBeTrue();
    });

    it('should return true if billing class is CREDIT, patient exists, but no globalHealthId', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = undefined;
        component.isSupported = true;
        component.deviceWorkstationID = 'some-id';
        component.fetchedFingerprints = false;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;
        expect(component.shouldShowStartVisitButton()).toBeTrue();
    });

    it('should return true if billing class is CREDIT, patient, globalHealthId, isSupported, but no deviceWorkstationID', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = 'some-id';
        component.isSupported = true;
        component.deviceWorkstationID = undefined;
        component.fetchedFingerprints = false;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;
        expect(component.shouldShowStartVisitButton()).toBeTrue();
    });

    it('should return true if billing class is CREDIT, patient, globalHealthId, isSupported, deviceWorkstationID, fetchedFingerprints, but not hasRequiredVerifiedFingers', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = 'some-id';
        component.isSupported = true;
        component.deviceWorkstationID = 'some-id';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;
        expect(component.shouldShowStartVisitButton()).toBeTrue();
    });

    it('should return true if billing class is CREDIT, patient, globalHealthId, isSupported, deviceWorkstationID, fetchedFingerprints, hasRequiredVerifiedFingers, and hasError', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = 'some-id';
        component.isSupported = true;
        component.deviceWorkstationID = 'some-id';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = true;
        component.hasError = true;
        expect(component.shouldShowStartVisitButton()).toBeTrue();
    });

    it('should call biometricsService.checkBiometricsHardwareDevice if OS is supported', () => {
        const mockPatient = {
            global_health_id: '1234567890',
        };

        const biometricsSpy = spyOn(
            component['biometricsService'],
            'checkBiometricsHardwareDevice'
        );
        spyOn(
            component['operatingSystemDetectionService'],
            'getCurrentOS'
        ).and.returnValue('Windows');
        spyOn(
            component['operatingSystemDetectionService'],
            'isCurrentOsSupported'
        ).and.returnValue(true);

        component.visitPatientObservable = of(mockPatient);
        component.getPatientDetails();

        expect(biometricsSpy).toHaveBeenCalledWith('1234567890');
    });

    it('should set unsupportedOS if the OS is not supported', () => {
        const mockPatient = {
            global_health_id: '1234567890',
        };

        spyOn(
            component['operatingSystemDetectionService'],
            'getCurrentOS'
        ).and.returnValue('Linux'); // simulate an unsupported OS

        spyOn(
            component['operatingSystemDetectionService'],
            'isCurrentOsSupported'
        ).and.returnValue(false);

        component.visitPatientObservable = of(mockPatient);
        component.getPatientDetails();

        expect(component.currentOS).toBe('Linux');
        expect(component.isSupported).toBeFalse();
        expect(component.unsupportedOS).toBe('Linux');
    });

    it('should test isFingerEnrolledAndVerified function', () => {
        const finger = 'Right Thumb';
        component.FINGERPOSITIONS = { 'Right Thumb': 1 };
        component.enrolledVerifiedPositions = [1, 2, 6, 7];

        spyOn(component, 'isFingerEnrolledAndVerified').and.callThrough();
        const result = component.isFingerEnrolledAndVerified(finger);
        expect(component.isFingerEnrolledAndVerified).toHaveBeenCalledWith(
            finger
        );
        expect(result).toBeTrue();
    });
    it('should return true from shouldShowClearButton when selectedVisitType is CHEMO', () => {
        component.selectedVisitType = 'CHEMO';
        const result = component.shouldShowClearButton();
        expect(result).toBeTrue();
    });

    it('should return true from shouldShowClearButton when selectedVisitType is RADIO', () => {
        component.selectedVisitType = 'RADIO';
        const result = component.shouldShowClearButton();
        expect(result).toBeTrue();
    });

    it('should return true from shouldShowClearButton when selectedVisitType is SURG', () => {
        component.selectedVisitType = 'SURG';
        const result = component.shouldShowClearButton();
        expect(result).toBeTrue();
    });

    it('should return false from shouldShowClearButton when selectedVisitType is not an Empower type', () => {
        component.selectedVisitType = 'AMB';
        const result = component.shouldShowClearButton();
        expect(result).toBeFalse();
    });

    it('should clear selectedVisitType when clearVisitType is called', () => {
        component.selectedVisitType = 'CHEMO';
        component.clearVisitType();
        expect(component.selectedVisitType).toBeUndefined();
    });

    it('should set selectedVisitType to undefined when clearVisitType is called', () => {
        component.selectedVisitType = 'RADIO';
        spyOn(component, 'clearVisitType').and.callThrough();
        component.clearVisitType();
        expect(component.clearVisitType).toHaveBeenCalled();
        expect(component.selectedVisitType).toBeUndefined();
    });
});

describe('StartVisitComponent - shouldShowStartVisitButton with CREDIT billing class when OS is not supported', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CREDIT, isSupported is false, and deviceWorkstationID is falsy', () => {
        component.selectedBillingClass = 'CREDIT';
        component.isSupported = false;
        component.deviceWorkstationID = undefined;

        component.patient = undefined;
        component.globalHealthId = undefined;
        component.fetchedFingerprints = false;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;

        const result = component.shouldShowStartVisitButton();

        expect(result).toBeTrue();

        spyOn(component, 'shouldShowStartVisitButton').and.callThrough();
        component.shouldShowStartVisitButton();
        expect(component.shouldShowStartVisitButton).toHaveBeenCalled();
    });
});

describe('StartVisitComponent - shouldShowStartVisitButton with CREDIT billing class when global health id is not present', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CREDIT, patient exists and globalHealthId is not present', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = undefined;

        component.isSupported = true;
        component.deviceWorkstationID = '123';
        component.fetchedFingerprints = false;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;

        const result = component.shouldShowStartVisitButton();
        expect(result).toBeTrue();

        spyOn(component, 'shouldShowStartVisitButton').and.callThrough();
        component.shouldShowStartVisitButton();
        expect(component.shouldShowStartVisitButton).toHaveBeenCalled();
    });
});

describe('StartVisitComponent - shouldShowStartVisitButton with CREDIT billing class when isSupported but has no workstationID', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CREDIT, patient exists, globalHealthId exists, isSupported is true and deviceWorkstationID is falsy', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.isSupported = true;
        component.deviceWorkstationID = undefined;

        component.fetchedFingerprints = false;
        component.hasRequiredVerifiedFingers = false;
        component.hasError = false;

        const result = component.shouldShowStartVisitButton();

        expect(result).toBeTrue();

        spyOn(component, 'shouldShowStartVisitButton').and.callThrough();
        component.shouldShowStartVisitButton();
        expect(component.shouldShowStartVisitButton).toHaveBeenCalled();
    });
});

describe('StartVisitComponent - shouldShowStartVisitButton with CREDIT billing class when hasRequiredVerifiedFingers is false', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CREDIT, patient exists, globalHealthId exists, isSupported, deviceWorkstationID, fetchedFingerprints, but !hasRequiredVerifiedFingers', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.isSupported = true;
        component.deviceWorkstationID = '123';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = false;

        component.hasError = false;

        const result = component.shouldShowStartVisitButton();

        expect(result).toBeTrue();

        spyOn(component, 'shouldShowStartVisitButton').and.callThrough();
        component.shouldShowStartVisitButton();
        expect(component.shouldShowStartVisitButton).toHaveBeenCalled();
    });
});

describe('StartVisitComponent - shouldShowStartVisitButton with CREDIT billing class when everything is present but has error', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CREDIT with all conditions satisfied but hasError is true', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.isSupported = true;
        component.deviceWorkstationID = '123';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = true;
        component.hasError = true;

        const result = component.shouldShowStartVisitButton();

        expect(result).toBeTrue();

        spyOn(component, 'shouldShowStartVisitButton').and.callThrough();
        component.shouldShowStartVisitButton();
        expect(component.shouldShowStartVisitButton).toHaveBeenCalled();
    });
});

describe('StartVisitComponent - shouldShowStartVisitButton with CREDIT billing class when everything is present but has hasFetchEnrolledError', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test shouldShowStartVisitButton and return true if billing class is CREDIT with all conditions satisfied but hasFetchEnrolledError is true', () => {
        component.selectedBillingClass = 'CREDIT';
        component.patient = mockPatientData as PatientModel;
        component.globalHealthId = '4580030000000551';
        component.isSupported = true;
        component.deviceWorkstationID = '123';
        component.fetchedFingerprints = true;
        component.hasRequiredVerifiedFingers = true;
        component.hasError = false;
        component.hasFetchEnrolledError = true;

        const result = component.shouldShowStartVisitButton();

        expect(result).toBeTrue();

        spyOn(component, 'shouldShowStartVisitButton').and.callThrough();
        component.shouldShowStartVisitButton();
        expect(component.shouldShowStartVisitButton).toHaveBeenCalled();
    });
});

describe('StartVisitComponent with matched false - verification failed', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;

        component.visitPatientObservable = of(mockPatientData);

        fixture.detectChanges();
    });

    it('should test ngOnInit method', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test selectFinger function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'selectFinger').and.callThrough();
        component.selectFinger(finger);
        expect(component.selectFinger).toHaveBeenCalledWith(finger);
    });

    it('should not proceed with selectFinger if authenticatedFinger is set', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = 'Right Thumb';
        component.showSpinner = false;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not proceed with selectFinger if showSpinner is true', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = null;
        component.showSpinner = true;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should test isFingerSelected function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'isFingerSelected').and.callThrough();
        component.isFingerSelected(finger);
        expect(component.isFingerSelected).toHaveBeenCalledWith(finger);
    });

    it('should test handleFingerprintAuthResponse function when matched is false', () => {
        const response = {
            matched: false,
            score: 26.666814770387404,
            match_log_id: null,
        };

        spyOn(component, 'handleFingerprintAuthResponse').and.callThrough();
        component.handleFingerprintAuthResponse(response);
        expect(component.handleFingerprintAuthResponse).toHaveBeenCalledWith(
            response
        );
    });

    it('should test authenticateFingerprint function when globalHealthId is not present', () => {
        component.globalHealthId = undefined;
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test authenticateFingerprint function when globalHealthId is present', () => {
        component.globalHealthId = '4580030000000551';
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test selectFinger function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'selectFinger').and.callThrough();
        component.selectFinger(finger);
        expect(component.selectFinger).toHaveBeenCalledWith(finger);
    });

    it('should not proceed with selectFinger if authenticatedFinger is set', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = 'Right Thumb';
        component.showSpinner = false;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not proceed with selectFinger if showSpinner is true', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = null;
        component.showSpinner = true;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should test isFingerSelected function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'isFingerSelected').and.callThrough();
        component.isFingerSelected(finger);
        expect(component.isFingerSelected).toHaveBeenCalledWith(finger);
    });
});

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('StartVisitComponent Error Path', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;
    });

    it('should handle errors in fetchScheme', () => {
        spyOn(component, 'fetchScheme').and.callThrough();
        component.fetchScheme(undefined);
        expect(component.fetchScheme).toHaveBeenCalled();
    });

    it('should test errors in syncPatientDetailToClinical function', () => {
        spyOn(component, 'syncPatientDetailToClinical').and.callThrough();
        component.syncPatientDetailToClinical();
        expect(component.syncPatientDetailToClinical).toHaveBeenCalled();
    });

    it('should test handleAuthenticationError method', () => {
        spyOn(component, 'handleAuthenticationError').and.callThrough();
        component.handleAuthenticationError({});
        expect(component.handleAuthenticationError).toHaveBeenCalled();
    });
});

describe('StartVisitComponent - Record Past Visit Checkbox Feature Flag', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;
    let flagServiceStub: FeatureFlagServiceStub;
    const mockPatientObservable = new BehaviorSubject<PatientModel>(
        mockPatientData
    );

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('healthIdFormatter'),
            ],
            providers: [
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                {
                    provide: PatientService,
                    useClass: PatientServiceStub,
                },
                {
                    provide: TranslateService,
                    useClass: TranslateServiceStub,
                },
                {
                    provide: Cookies,
                    useClass: CookieServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: Authorization,
                    useClass: AuthorizationStub,
                },
                {
                    provide: NbToastrService,
                    useClass: NbToastrServiceStub,
                },
                {
                    provide: AnalyticsService,
                    useValue: {
                        trackEvent: jasmine.createSpy('trackEvent'),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;
        component.visitPatientObservable = mockPatientObservable;
        flagServiceStub = TestBed.inject(FeatureFlagService) as any;
    });

    it('should set showRecordPastVisitCheckbox to true when feature flags are loaded and current variant is allowed', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue(
            'accessafya;empower;default'
        );
        environment.variant = 'accessafya';
        (component as any).initializeRecordPastVisitCheckbox();
        expect(component.showRecordPastVisitCheckbox).toBe(true);
        expect(flagServiceStub.getForcedValue).toHaveBeenCalledWith(
            'prov_showRecordPastVisitCheckbox'
        );
    });

    it('should set showRecordPastVisitCheckbox to false when current variant is not in allowed list', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue(
            'empower;default'
        );
        environment.variant = 'accessafya';
        (component as any).initializeRecordPastVisitCheckbox();
        expect(component.showRecordPastVisitCheckbox).toBe(false);
    });

    it('should set showRecordPastVisitCheckbox to false when feature flag returns empty value', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue('');
        environment.variant = 'accessafya';
        (component as any).initializeRecordPastVisitCheckbox();
        expect(component.showRecordPastVisitCheckbox).toBe(false);
    });

    it('should set showRecordPastVisitCheckbox to false when feature flag returns null', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue(null);
        environment.variant = 'accessafya';
        (component as any).initializeRecordPastVisitCheckbox();
        expect(component.showRecordPastVisitCheckbox).toBe(false);
    });

    it('should subscribe to flagsLoadedEmitter when features are not loaded yet', () => {
        flagServiceStub.featuresLoaded = false;
        const subscribeSpy = jasmine
            .createSpy('subscribe')
            .and.callFake((callback: () => void) => {
                flagServiceStub.featuresLoaded = true;
                spyOn(flagServiceStub, 'getForcedValue').and.returnValue(
                    'accessafya;empower'
                );
                environment.variant = 'accessafya';
                callback();
            });
        flagServiceStub.flagsLoadedEmitter.subscribe = subscribeSpy;
        (component as any).initializeRecordPastVisitCheckbox();
        expect(subscribeSpy).toHaveBeenCalled();
        expect(component.showRecordPastVisitCheckbox).toBe(true);
    });

    it('should handle different variant formats correctly', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue(
            'accessafya;empower;default'
        );
        environment.variant = 'empower';
        (component as any).setRecordPastVisitCheckboxVisibility();
        expect(component.showRecordPastVisitCheckbox).toBe(true);
        environment.variant = 'default';
        (component as any).setRecordPastVisitCheckboxVisibility();
        expect(component.showRecordPastVisitCheckbox).toBe(true);
        environment.variant = 'unlisted';
        (component as any).setRecordPastVisitCheckboxVisibility();
        expect(component.showRecordPastVisitCheckbox).toBe(false);
    });

    it('should handle single variant in flag value', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue('accessafya');
        environment.variant = 'accessafya';
        (component as any).setRecordPastVisitCheckboxVisibility();
        expect(component.showRecordPastVisitCheckbox).toBe(true);
    });

    it('should handle variants with extra whitespace', () => {
        flagServiceStub.featuresLoaded = true;
        spyOn(flagServiceStub, 'getForcedValue').and.returnValue(
            ' accessafya ; empower ; default '
        );
        environment.variant = 'empower';
        (component as any).setRecordPastVisitCheckboxVisibility();
        expect(component.showRecordPastVisitCheckbox).toBe(true);
    });

    it('should initialize record past visit checkbox during ngOnInit', () => {
        spyOn(component as any, 'initializeRecordPastVisitCheckbox');
        component.ngOnInit();
        expect(
            (component as any).initializeRecordPastVisitCheckbox
        ).toHaveBeenCalled();
    });

    afterEach(() => {
        environment.variant = 'default';
    });
});
