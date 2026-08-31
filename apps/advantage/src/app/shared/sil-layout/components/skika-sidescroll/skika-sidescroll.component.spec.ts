import { SkikaSidescrollComponent } from './skika-sidescroll.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SkikaDialogueComponent', () => {
    let component: SkikaSidescrollComponent;
    let fixture: ComponentFixture<SkikaSidescrollComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaSidescrollComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaSidescrollComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test toggleModalState method', () => {
        component.scrollTo({});
        expect(component).toBeTruthy();
        expect(component.scrollTo).toBeTruthy();
    });
});
