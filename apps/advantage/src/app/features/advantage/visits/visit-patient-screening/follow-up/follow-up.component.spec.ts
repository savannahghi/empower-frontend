import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpComponent } from './follow-up.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
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
    getOrgSettings() {
        return [
            {
                id: '260bb4db-59b7-4f93-b2fd-fe88d3af21a3',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ];
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
    transitionTo() {
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
describe('FollowUpComponent', () => {
    let component: FollowUpComponent;
    let fixture: ComponentFixture<FollowUpComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FollowUpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },

                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        });
        fixture = TestBed.createComponent(FollowUpComponent);
        component = fixture.componentInstance;
        component.cancerType = 'cervical';
        component.followUpData = {
            id: '90814-0194',
            value: 'Negative',
        };

        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            visit_status: 'IN PROGRESS',
            personID: '8583-2851-8184',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };

        component.pageText = {
            breast: {
                normal: {
                    label: 'Normal',
                    badgeColor: '#276F09',
                    badgeBackgroundColor: '#F6FFED',
                },
                abnormal: {
                    label: 'Abnormal',
                    badgeColor: '#DA0A15',
                    badgeBackgroundColor: '#FFF1F0',
                },
            },
            cervical: {
                negative: {
                    label: 'Negative',
                    badgeColor: '#276F09',
                    badgeBackgroundColor: '#F6FFED',
                },
                positive: {
                    label: 'Positive',
                    badgeColor: '#DA0A15',
                    badgeBackgroundColor: '#FFF1F0',
                },
                suspicious: {
                    label: 'Suspicious for cancer',
                    badgeColor: '#FFB573',
                    badgeBackgroundColor: '#FCF7E8',
                },
            },
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component.screeningStatus).toBe('negative');
        expect(component).toBeTruthy();
    });

    it('should test ngOnInit and call segments Function', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(component, 'checkStatus').and.callThrough();
        spyOn(component, 'getSegments').and.callThrough();

        component.encounterStatus = 'FINISHED';
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.checkStatus).toHaveBeenCalled();

        expect(component.getSegments).toHaveBeenCalled();
    });
});

describe('FollowUpComponent alternative', () => {
    let component: FollowUpComponent;
    let fixture: ComponentFixture<FollowUpComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FollowUpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },

                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        });
        fixture = TestBed.createComponent(FollowUpComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';
        component.followUpData = {
            id: '7742-8585',
            value: 'BIRADS 4',
        };

        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            visit_status: 'IN PROGRESS',
            personID: '8583-2851-8184',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };

        component.pageText = {
            breast: {
                normal: {
                    label: 'Normal',
                    badgeColor: '#276F09',
                    badgeBackgroundColor: '#F6FFED',
                },
                abnormal: {
                    label: 'Abnormal',
                    badgeColor: '#DA0A15',
                    badgeBackgroundColor: '#FFF1F0',
                },
            },
            cervical: {
                negative: {
                    label: 'Negative',
                    badgeColor: '#276F09',
                    badgeBackgroundColor: '#F6FFED',
                },
                positive: {
                    label: 'Positive',
                    badgeColor: '#DA0A15',
                    badgeBackgroundColor: '#FFF1F0',
                },
                suspicious: {
                    label: 'Suspicious for cancer',
                    badgeColor: '#FFB573',
                    badgeBackgroundColor: '#FCF7E8',
                },
            },
        };
        fixture.detectChanges();
    });

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.screeningStatus).toBe('abnormal');
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });

    it('should test getSegments functions', () => {
        spyOn(component, 'getSegments').and.callThrough();
        component.getSegments('8583-2851-8184');
        expect(component.getSegments).toHaveBeenCalled();
    });

    it('should test convertString function', () => {
        spyOn(component, 'convertString').and.callThrough();

        const formattedString = component.convertString('fail_safe');
        expect(formattedString).toBe('fail safe');
        expect(component.convertString).toHaveBeenCalled();
    });
});
