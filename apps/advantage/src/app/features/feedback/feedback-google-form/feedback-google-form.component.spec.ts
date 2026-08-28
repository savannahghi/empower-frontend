import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/core';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';

import { FeedbackGoogleFormComponent } from './feedback-google-form.component';

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
    includes() {
        return false;
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

describe('FeedbackGoogleFormComponent', () => {
    let component: FeedbackGoogleFormComponent;
    let fixture: ComponentFixture<FeedbackGoogleFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackGoogleFormComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackGoogleFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
