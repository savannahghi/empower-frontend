import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpHandler, HttpClient } from '@angular/common/http';

import { AppConfigService } from '../../../../app-config.service';
import { HomePageService } from '../home-page.service';
import { Setup } from '../setup.service';
import { Authorization } from '../authorization.service';
import { DataLayerUtils } from '../datalayer.utils.service';
import { Oauth2Service } from '../oauth2.service';
import { NbStatusService } from '@nebular/theme';

const httpDep = [HttpHandler, HttpClient];

class NbStatusServiceStub {
    isCustomStatus() {}
}

describe('HomePage service', () => {
    let homePageServices: HomePageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                HomePageService,
                Authorization,
                Oauth2Service,
                DataLayerUtils,
                AppConfigService,
                Setup,
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                [...httpDep],
            ],
        });
        homePageServices = TestBed.inject(HomePageService);
    });

    it('Should create the service', () => {
        homePageServices.pageCheckers = null;
        homePageServices.router.config = [{ path: 'path' }];
        homePageServices.homePages = ['path'];
        homePageServices.getAllAvailableState();
        homePageServices.determineHomePage();
        expect(homePageServices).toBeTruthy();
    });

    it('Should create the service', () => {
        homePageServices.pageCheckers = null;
        homePageServices.router.config = [{ path: 'path' }];
        homePageServices.getAllAvailableState();
        homePageServices.determineHomePage();
        expect(homePageServices).toBeTruthy();
    });
});
