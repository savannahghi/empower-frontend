import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalReviewComponent } from './final-review.component';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
    error() {
        return of(() => {});
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

describe('FinalReviewComponent', () => {
    let component: FinalReviewComponent;
    let fixture: ComponentFixture<FinalReviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinalReviewComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalReviewComponent);
        component = fixture.componentInstance;
        component.providerData = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
