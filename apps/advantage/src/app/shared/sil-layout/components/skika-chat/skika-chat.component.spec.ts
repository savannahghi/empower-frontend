import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SkikaChatComponent } from './skika-chat.component';

describe('SkikaChatComponent', () => {
    let component: SkikaChatComponent;
    let fixture: ComponentFixture<SkikaChatComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaChatComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaChatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test toggleChatState method', () => {
        component.toggleChatState();
        expect(component).toBeTruthy();
        expect(component.toggleChatState).toBeTruthy();
    });
});
