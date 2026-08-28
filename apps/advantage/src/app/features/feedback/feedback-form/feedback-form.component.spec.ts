import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/core';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';

import { FeedbackFormComponent } from './feedback-form.component';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    params: {
        hash: '403',
        payer: '2001',
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
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

describe('FeedbackFormComponent', () => {
    let component: FeedbackFormComponent;
    let fixture: ComponentFixture<FeedbackFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackFormComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test submitSurvey', () => {
        const form = {
            duration_medical_services: {
                score_response: '2',
            },
            rate_medical_services: {
                score_response: '2',
            },
            rate_medical_staff: {
                score_response: '2',
            },
            rate_wellness_card: {
                score_response: '2',
            },
            recommend_wellness_card: {
                score_response: '2',
            },
            recommendation: {
                long_text_response: '2',
            },
        };
        const form2 = {
            duration_medical_services: {
                score_response: '2',
            },
            rate_medical_services: {
                score_response: '2',
            },
            rate_medical_staff: {
                score_response: '2',
            },
            rate_wellness_card: {
                score_response: '2',
            },
            recommend_wellness_card: {
                score_response: '2',
            },
        };
        component.submitSurvey(form);
        component.submitSurvey(form2);
        expect(component).toBeTruthy();
    });
});

const uIRouterGlobalsStub2 = {
    params: {},
};

describe('FeedbackFormComponent with no hash', () => {
    let component: FeedbackFormComponent;
    let fixture: ComponentFixture<FeedbackFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackFormComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create | no param defined', () => {
        expect(component).toBeTruthy();
    });
});
