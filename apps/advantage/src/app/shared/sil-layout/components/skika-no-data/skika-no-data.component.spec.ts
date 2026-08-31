import { SkikaNoDataComponent } from './skika-no-data.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SkikaDialogueComponent', () => {
    let component: SkikaNoDataComponent;
    let fixture: ComponentFixture<SkikaNoDataComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaNoDataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaNoDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
