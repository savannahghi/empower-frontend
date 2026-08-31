import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import {
    RouterModule,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    UrlSegment,
    Params,
    ParamMap,
} from '@angular/router';

import { AuthGuard } from '../auth-guard.service';
import { routes } from '../../auth-routing.module';
import { AuthenticationService } from '../authentication.service';

import { SkikaAuthComponent } from '../../components/skika-auth/skika-auth.component';

import { SkikaLoginComponent } from '../../components/login/login.component';
import { SilLogoutComponent } from '../../components/logout/logout.component';
import { CompleteAuthComponent } from '../../components/complete/complete.component';
import { SkikaRegisterComponent } from '../../components/register/register.component';

const routerProviders = [];

const authCmpts = [
    SkikaRegisterComponent,
    SkikaAuthComponent,
    SkikaLoginComponent,
    SilLogoutComponent,
    CompleteAuthComponent,
];

const activeRoute: ActivatedRouteSnapshot = null;
const urlSeg: UrlSegment[] = null;
const params: Params = null;
const map: ParamMap = null;

const path: ActivatedRouteSnapshot[] = null;

const activatedRoute = {
    url: urlSeg,
    root: activeRoute,
    params,
    queryParams: params,
    fragment: '',
    outlet: '',
    component: '',
    parent: activeRoute,
    firstChild: activeRoute,
    children: [],
    pathFromRoot: path,
    paramMap: map,
    queryParamMap: map,
    data: {
        actions: ['test'],
    },
};

class AuthenticationServiceStub {
    isAuthenticated() {
        return true;
    }
}

describe('AuthGuard service', () => {
    let authGuardService: AuthGuard;
    const mockSnapshot: any = jasmine.createSpyObj<RouterStateSnapshot>(
        'RouterStateSnapshot',
        ['toString']
    );

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'auth/login', component: SkikaLoginComponent },
                ]),
                RouterModule.forChild(routes),
            ],
            providers: [
                AuthGuard,
                [...routerProviders],
                { provide: ActivatedRouteSnapshot, useValue: activatedRoute },
                { provide: RouterStateSnapshot, useValue: mockSnapshot },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
            ],
            declarations: [...authCmpts],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        authGuardService = TestBed.inject(AuthGuard);
    });

    it('should test', () => {
        expect(authGuardService).toBeTruthy();
    });

    it('should test canActivate method', () => {
        spyOn(authGuardService, 'canActivate').and.callThrough();
        authGuardService.canActivate();
        expect(authGuardService.canActivate).toHaveBeenCalled();
    });
});

class AuthenticationServiceStub2 {
    isAuthenticated() {
        return false;
    }
}

describe('AuthGuard service', () => {
    let authGuardService: AuthGuard;
    const mockSnapshot: any = jasmine.createSpyObj<RouterStateSnapshot>(
        'RouterStateSnapshot',
        ['toString']
    );

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'auth/login', component: SkikaLoginComponent },
                ]),
                RouterModule.forChild(routes),
            ],
            providers: [
                AuthGuard,
                [...routerProviders],
                { provide: ActivatedRouteSnapshot, useValue: activatedRoute },
                { provide: RouterStateSnapshot, useValue: mockSnapshot },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub2,
                },
            ],
            declarations: [...authCmpts],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        authGuardService = TestBed.inject(AuthGuard);
    });

    it('should test canActivate method', () => {
        spyOn(authGuardService, 'canActivate').and.callThrough();
        authGuardService.canActivate();
        expect(authGuardService.canActivate).toHaveBeenCalled();
    });
});
