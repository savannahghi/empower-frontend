import { SkikaTitleComponent } from './skika-title.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SkikaDialogueComponent', () => {
    let component: SkikaTitleComponent;
    let fixture: ComponentFixture<SkikaTitleComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaTitleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
