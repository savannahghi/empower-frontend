import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTitleComponent } from './section-title.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbStatusService } from '@nebular/theme';

class NbStatusServiceStub {
    isCustomStatus() {}
}
describe('SectionTitleComponent', () => {
    let component: SectionTitleComponent;
    let fixture: ComponentFixture<SectionTitleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SectionTitleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SectionTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
