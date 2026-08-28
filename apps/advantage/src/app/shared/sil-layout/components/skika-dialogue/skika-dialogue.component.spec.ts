import { SkikaDialogueComponent } from './skika-dialogue.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SkikaDialogueComponent', () => {
    let component: SkikaDialogueComponent;
    let fixture: ComponentFixture<SkikaDialogueComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaDialogueComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaDialogueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test toggleModalState method', () => {
        component.toggleModalState();
        expect(component).toBeTruthy();
        expect(component.toggleModalState).toBeTruthy();
    });

    it('should test toggleHeaderState method', () => {
        component.toggleHeaderState();
        expect(component).toBeTruthy();
        expect(component.toggleHeaderState).toBeTruthy();
    });
});
