import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import {
    APP_BASE_HREF,
    Location,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';

import { of } from 'rxjs';

import { AppConfigService } from '../../../../app-config.service';
import { DataLayerUtils } from '../datalayer.utils.service';
import { Oauth2Service } from '../oauth2.service';
import { SessionService } from '../session.service';
import { Authorization } from '../authorization.service';
import { StateService } from '@uirouter/angular';

const locDepArray = [
    Location,
    PathLocationStrategy,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
];

const httpDepArray = [HttpHandler, HttpClient];

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
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
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

describe('Session service', () => {
    let sessionService: SessionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SessionService,
                Authorization,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                [...httpDepArray],
                [...locDepArray],
                { provide: APP_BASE_HREF, useValue: '/my/app' },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 123 }),
                        snapshot: { data: { title: 'myTitle ' } },
                        routeConfig: { children: { filter: () => {} } },
                    },
                },
            ],
        });
        sessionService = TestBed.inject(SessionService);
    });

    it('Should create the service', () => {
        const state = JSON.stringify({ name: 'auth' });
        const paramObj = { id: 1 };
        sessionService.dumpState(state, paramObj);
        sessionService.clearState();
        sessionService.loadState();
        expect(sessionService).toBeTruthy();
    });

    it('Should test dumpstate function user is defined', () => {
        spyOn(sessionService.authConfig, 'getUser').and.returnValue({
            id: '1',
        });
        spyOn(sessionService.cookieService, 'get').and.returnValue({
            uid: '1',
        });
        const state = JSON.stringify({ name: 'auth' });
        const paramObj = { id: 1 };
        sessionService.dumpState(state, paramObj);
        sessionService.loadState();
        expect(sessionService.authConfig.getUser).toHaveBeenCalled();
    });

    it('Should test dumpstate function user info undefined', () => {
        spyOn(sessionService.authConfig, 'getUser').and.returnValue(false);
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify({ uid: '1' })
        );
        const state = JSON.stringify({ name: 'auth' });
        const paramObj = { id: 1 };
        sessionService.dumpState(state, paramObj);
        sessionService.loadState();
        expect(sessionService.authConfig.getUser).toHaveBeenCalled();
    });

    it('Should test loadstate function test', () => {
        spyOn(sessionService.authConfig, 'getUser').and.returnValue({
            id: '1',
        });
        const state = JSON.stringify({ name: 'auth' });
        const paramObj = { id: 1 };
        sessionService.dumpState(state, paramObj);
        sessionService.dumpUrl('1212312312');
        sessionService.loadState();
        sessionService.loadUrl();
        sessionService.clearUrl();
        expect(sessionService.authConfig.getUser).toHaveBeenCalled();
    });

    it('Should test loadstate function', () => {
        spyOn(sessionService.authConfig, 'getUser').and.returnValue(
            JSON.stringify({ id: '1' })
        );
        spyOn(Storage.prototype, 'getItem').and.returnValue(
            JSON.stringify({ uid: 123 })
        );
        const state = JSON.stringify({ name: 'auth' });
        const paramObj = { id: 1 };
        sessionService.dumpState(state, paramObj);
        sessionService.loadState();
        expect(sessionService.authConfig.getUser).toHaveBeenCalled();
    });

    it('Should test loadstate function and dump is defined and matches user id', () => {
        spyOn(sessionService.cookieService, 'get').and.returnValue({
            id: '2',
            uid: '2',
        });
        spyOn(Storage.prototype, 'getItem').and.returnValue(
            JSON.stringify({ uid: 123 })
        );
        const state = JSON.stringify({ name: 'auth' });
        const paramObj = { id: 1 };
        sessionService.dumpState(state, paramObj);
        sessionService.loadState();
        expect(sessionService.cookieService.get).toHaveBeenCalled();
    });
});
