import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCardComponent } from './action-card.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbStatusService } from '@nebular/theme';

class NbStatusServiceStub {
    isCustomStatus() {}
}
describe('ActionCardComponent', () => {
    let component: ActionCardComponent;
    let fixture: ComponentFixture<ActionCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActionCardComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ActionCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
