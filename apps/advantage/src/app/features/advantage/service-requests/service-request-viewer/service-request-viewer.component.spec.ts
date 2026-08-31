import {
    ComponentFixture,
    fakeAsync,
    tick,
    TestBed,
} from '@angular/core/testing';

import { ServiceRequestViewerComponent } from './service-request-viewer.component';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SimpleChange, InjectionToken } from '@angular/core';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { of } from 'rxjs';
import {
    NbIconLibraries,
    NbStatusService,
    NbToastrService,
} from '@nebular/theme';
import {
    SweetAlert2LoaderService,
    SweetAlert2Module,
} from '@sweetalert2/ngx-sweetalert2';
import OriginalSwal from 'sweetalert2';
import Swal from 'sweetalert2';
import { PatientService } from '../../patients/patient.service';
import { VisitService } from '../../visits/visit.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { service_request: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { visit: 1 };
        },
    },
};

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

class SweetAlert2LoaderServiceStub {
    swal() {
        return {};
    }
    preloadSweetAlertLibrary() {
        return {};
    }
    fire() {
        return {};
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getToken() {
        return {};
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setOrganisationSettings() {
        return of(() => {});
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
            roles: ['Quintus'],
            permissions: ['advantage.visit_list', 'erp.dashboard_list'],
        };
    }
    getWorkstation() {
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
    monitor() {
        return of(() => {});
    }
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    close() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
    }
    checkIfPatientIsComplete() {
        return of({
            id: '143224',
        });
    }
}

class VisitServiceStub {
    visitPatientDataEmitter = {
        subscribe: () => {
            return { id: '143224' };
        },
        next: () => {
            return { id: '143224' };
        },
    };
    fetchVisit() {
        return true;
    }
    queuesDataEmitter = {
        subscribe: () => {
            return { id: '143224' };
        },
        next: () => {
            return { id: '143224' };
        },
    };
    visitDataEmitter = {
        subscribe: () => {
            return { id: '143224' };
        },
        next: () => {
            return { id: '143224' };
        },
    };
    checkIfPatientIsComplete() {
        return of({
            id: '143224',
        });
    }
}

describe('ServiceRequestViewerComponent', () => {
    let component: ServiceRequestViewerComponent;
    let fixture: ComponentFixture<ServiceRequestViewerComponent>;

    beforeEach(async () => {
        let swal: typeof OriginalSwal;

        const swalProviderToken = new InjectionToken<typeof Swal>(
            '@sweetalert2/ngx-sweetalert2#swalProvider'
        );

        const fireOnInitToken = new InjectionToken<boolean>(
            '@sweetalert2/ngx-sweetalert2#fireOnInit'
        );

        const dismissOnDestroyToken = new InjectionToken<boolean>(
            '@sweetalert2/ngx-sweetalert2#dismissOnDestroy'
        );
        await TestBed.configureTestingModule({
            imports: [
                ServiceRequestViewerComponent,
                SweetAlert2Module.forRoot(),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                SweetAlert2LoaderService,
                { provide: swalProviderToken, useValue: swal },
                { provide: fireOnInitToken, useValue: false },
                { provide: dismissOnDestroyToken, useValue: true },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: VisitService, useClass: VisitServiceStub },
                {
                    provide: SweetAlert2Module,
                    useClass: SweetAlert2Module,
                },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: SweetAlert2LoaderService,
                    useClass: SweetAlert2LoaderServiceStub,
                },
                {
                    provide: InjectionToken,
                    useClass: SweetAlert2LoaderServiceStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceRequestViewerComponent);
        component = fixture.componentInstance;
        spyOn(component.patientService, 'checkIfPatientIsComplete');
        fixture.detectChanges();
    });

    it('should test navigationToServiceRequest', fakeAsync(() => {
        component.request = { id: 1 };
        component.changeQueue({ id: 1, queue: 2, service_request: 1 });
        component.serviceRequestService.setServiceRequest({ visit: 1, id: 1 });
        spyOn(component, 'navigateToServiceRequest').and.callThrough();
        component.ngOnChanges({
            request: new SimpleChange(null, { id: 1, visit: 1 }, false),
        });
        component.getFilteredResponse({});
        component.serviceRequestObservable();
        component.visitServiceObservable();
        component.toggleModal('context');
        component.visit = { id: 1 };
        component.selectedQueue = { id: 1 };
        component.sendToQueue();
        component.request = { id: 1 };
        component.startServiceRequest();
        component.getQueues();
        component.completeSendToQueue({});
        component.handleError({});
        component.receiveQueues([{ id: 1 }]);
        component.completeSendToQueue({ id: 1 });
        component.setVisit({ id: 11 });
        component.receivePatient({ id: 11 });
        component.navigateToServiceRequest({ visit: 11, id: 1 });
        tick(600);
        expect(component).toBeTruthy();
    }));

    it('should test receivePatient', fakeAsync(() => {
        component.request = { id: 1 };
        component.receivePatient({ id: 11 });
        tick(1000);
        expect(component).toBeTruthy();
    }));

    it('should return true if currentWorkstationType is clinical and status is WAITING', () => {
        const mockVisit = {
            service_requests: [{ status: 'WAITING' }],
        };
        component.currentWorkstationType = 'screening';
        component.visit = mockVisit;
        expect(component.showTimeline()).toBeTrue();
    });

    it('should return false if currentWorkstationType is not clinical', () => {
        component.currentWorkstationType = 'billing';
        expect(component.showTimeline()).toBeFalse();
    });
});
