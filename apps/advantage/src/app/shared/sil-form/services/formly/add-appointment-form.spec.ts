import { AppointmentFieldsService } from './add-appointment-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import moment from 'moment';
import { StateService } from '@uirouter/angular';
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
                },
                {
                    id: 2,
                },
                {
                    id: 3,
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

describe('AppointmentFieldsService', () => {
    let service: AppointmentFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AppointmentFieldsService,
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
        service = TestBed.inject(AppointmentFieldsService);
    });

    it('should test fields: patient and schedule', fakeAsync(() => {
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
        expect(service.fields).toHaveBeenCalled();

        /**
         * expression tests
         */
        const field = {
            model: {
                schedule: {
                    name: 'Provider',
                },
            },
            formControl: {
                pristine: true,
            },
        };

        /**
         * _expressionProperties: schedule
         */
        fields[1].expressions['model.schedule']({ formControl: {}, model: {} });
        fields[1].expressions['model.schedule'](field);

        // searchFxn: schedule
        tick(2000);
        expect(service.fields).toBeDefined();
    }));
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('AppointmentFieldsService: error', () => {
    let service: AppointmentFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AppointmentFieldsService,
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
        service = TestBed.inject(AppointmentFieldsService);
    });

    it('should test fields: patient and schedule', fakeAsync(() => {
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

        const scheduleField = {
            props: {},
            formControl: {
                markAsDirty: () => {},
                markAsPristine: () => {},
            },
            model: {
                slot_resource: {
                    schedule_name: 'Ortho',
                },
                schedule: {
                    name: 'Provider',
                },
            },
        };

        /**
         * _expressionProperties: schedule
         */
        fields[1].expressions['model.schedule'](scheduleField);

        const startDate = moment().startOf('date');
        service['startDate'] = startDate.add(3, 'hours').toISOString();
        service['slotField'] = {};
        fields[1].expressions['model.schedule'](scheduleField);

        tick(2000);
        expect(service.fields).toHaveBeenCalled();
    }));
});
