import { checkinFieldService } from './add-checkin-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { StateService } from '@uirouter/angular';
import moment from 'moment';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    appointment_status: 'BOOKED',
                },
            ],
        });
    }
}
class SilStoresServiceStub2 {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    appointment_status: 'ARRIVED',
                },
            ],
        });
    }
}

class SilStoresServiceStub3 {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    appointment_status: '',
                },
            ],
        });
    }
}
class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('checkinFieldService BOOKED', () => {
    let service: checkinFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                checkinFieldService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(checkinFieldService);
    });

    it('should test check-in fields: patient', fakeAsync(() => {
        const comp = {
            model: {
                business_partner: 1,
            },
            getModel: () => {},
            fields: [
                {},
                {
                    props: {
                        options: [],
                    },
                },
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field = {
            model: {
                patient: '1',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
            value: '123123',
            defaultValue: undefined,
        };
        fields[1].asyncValidators.custom.expression(field);
        service.patientExists = true;
        fields[3].expressionProperties['template']();

        expect(service.fields).toHaveBeenCalled();
        service.patientExists;
    }));
});

describe('checkinFieldService ARRIVED', () => {
    let service: checkinFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                checkinFieldService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(checkinFieldService);
    });

    it('should test check-in fields: patient', fakeAsync(() => {
        const comp = {
            model: {
                business_partner: 1,
            },
            getModel: () => {},
            fields: [
                {},
                {
                    props: {
                        options: [],
                    },
                },
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field = {
            model: {
                patient: '1',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
            defaultValue: undefined,
            parent: {
                controls: {
                    visit_date: {
                        value: moment(),
                    },
                },
            },
        };
        fields[1].asyncValidators.custom.expression(field);
        fields[3].expressionProperties['template']();
        const data = {
            results: [],
        };
        service.switchMapFunction(data);
        expect(service.fields).toHaveBeenCalled();
    }));
});

describe('checkinFieldService: empty', () => {
    let service: checkinFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                checkinFieldService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(checkinFieldService);
    });

    it('should test check-in fields: patient', fakeAsync(() => {
        const comp = {
            model: {
                business_partner: 1,
            },
            getModel: () => {},
            fields: [
                {},
                {
                    props: {
                        options: [],
                    },
                },
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        fields[3].expressionProperties['template']();

        const field = {
            model: {
                patient: '',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
            defaultValue: undefined,
        };

        fields[1].asyncValidators.custom.expression(field);
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should test future check-in fields: patient', fakeAsync(() => {
        const comp = {
            secondaryData: { showDate: true, futureCheckIn: true },
            model: {
                business_partner: 1,
            },
            getModel: () => {},
            fields: [
                {},
                {
                    props: {
                        options: [],
                    },
                },
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        fields[3].expressionProperties['template']();

        const field = {
            model: {
                patient: '',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
            defaultValue: undefined,
        };

        fields[1].asyncValidators.custom.expression(field);
        expect(service.fields).toHaveBeenCalled();
    }));
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('checkinFieldService: error', () => {
    let service: checkinFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                checkinFieldService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(checkinFieldService);
    });

    it('should test fields: patient', fakeAsync(() => {
        const comp = {
            model: {
                business_partner: 1,
            },
            getModel: () => {},
            fields: [
                {},
                {
                    props: {
                        options: [],
                    },
                },
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        fields[3].expressionProperties['template']();

        const field = {
            model: {
                patient: '1',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
            defaultValue: undefined,
        };
        fields[1].asyncValidators.custom.expression(field);
        expect(service.fields).toHaveBeenCalled();
    }));
});
