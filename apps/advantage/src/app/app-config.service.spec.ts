import { AppConfigService, appInitializeFn } from './app-config.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AppConfigService', () => {
    let service: AppConfigService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [RouterTestingModule],
            providers: [
                AppConfigService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(AppConfigService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should test function', fakeAsync(() => {
        spyOn(service, 'loadAppConfig').and.callThrough();
        service.appConfig = { data: {}, loadAppConfig: () => {} };
        service.getConfig();
        service.loadAppConfig();
        const url = 'assets/data/appConfig.json';
        const req = httpMock.expectOne(url);
        req.flush({ name: 'test' });
        appInitializeFn(service.appConfig)();
        expect(service.loadAppConfig).toHaveBeenCalled();
    }));
});
