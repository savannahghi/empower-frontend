import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/core';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';

import { FeedbackSubmittedComponent } from './feedback-submitted.component';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    params: {
        hash: '403',
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            id: 'grsgg342332sf',
        });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }
}

describe('FeedbackSubmittedComponent', () => {
    let component: FeedbackSubmittedComponent;
    let fixture: ComponentFixture<FeedbackSubmittedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackSubmittedComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackSubmittedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

const uIRouterGlobalsStub2 = {
    params: { t: '403' },
};

describe('FeedbackSubmittedComponent', () => {
    let component: FeedbackSubmittedComponent;
    let fixture: ComponentFixture<FeedbackSubmittedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackSubmittedComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackSubmittedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create | param for advantage survey', () => {
        expect(component).toBeTruthy();
    });
});

const uIRouterGlobalsStub3 = {
    params: {},
};

describe('FeedbackSubmittedComponent', () => {
    let component: FeedbackSubmittedComponent;
    let fixture: ComponentFixture<FeedbackSubmittedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackSubmittedComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackSubmittedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create | no param defined', () => {
        expect(component).toBeTruthy();
    });
});
