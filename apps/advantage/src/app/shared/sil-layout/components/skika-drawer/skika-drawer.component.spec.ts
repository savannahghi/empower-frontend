import { SkikaDrawerComponent } from './skika-drawer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SkikaDialogueComponent', () => {
    let component: SkikaDrawerComponent;
    let fixture: ComponentFixture<SkikaDrawerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaDrawerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaDrawerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test toggleModalState method', () => {
        component.toggleDrawerState();
        expect(component).toBeTruthy();
        expect(component.toggleDrawerState).toBeTruthy();
    });
});
