import { TestBed, fakeAsync } from '@angular/core/testing';
import { HomePageService } from './home-page.service';
import { ActivatedRoute } from '@angular/router';
import { Authorization } from './authorization.service';
import {
    Location,
    LocationStrategy,
    PathLocationStrategy,
    APP_BASE_HREF,
} from '@angular/common';
import { Oauth2Service } from './oauth2.service';
import { AppConfigService } from '../../../app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DataLayerUtils } from './datalayer.utils.service';
import { Setup } from './setup.service';

import { RouterTestingModule } from '@angular/router/testing';

describe('HomePageService', () => {
    let service: HomePageService;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                HomePageService,
                Authorization,
                Location,
                Oauth2Service,
                DataLayerUtils,
                AppConfigService,
                HttpClient,
                HttpHandler,
                Setup,
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                { provide: APP_BASE_HREF, useValue: '/my/app' },
                { provide: ActivatedRoute, useValue: {} },
            ],

            declarations: [],
        });
    }));

    beforeEach(() => {
        service = TestBed.inject(HomePageService);
    });

    it('ngOnInit to have been called', () => {
        spyOn(service, 'determineHomePage').and.callThrough();
        service.determineHomePage();
        expect(service.determineHomePage).toHaveBeenCalled();
    });

    it('determineHomePage to loop through availableStates', () => {
        const setup = TestBed.inject(Setup);
        expect(service.determineHomePage()).toBe(setup.authStates.loginState);
    });
});
