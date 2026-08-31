import { SkikaSideContentComponent } from './skika-side-content.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SkikaDialogueComponent', () => {
    let component: SkikaSideContentComponent;
    let fixture: ComponentFixture<SkikaSideContentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaSideContentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaSideContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
