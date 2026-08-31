import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCardComponent } from './display-card.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbStatusService } from '@nebular/theme';

class NbStatusServiceStub {
    isCustomStatus() {}
}
describe('DisplayCardComponent', () => {
    let component: DisplayCardComponent;
    let fixture: ComponentFixture<DisplayCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisplayCardComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
