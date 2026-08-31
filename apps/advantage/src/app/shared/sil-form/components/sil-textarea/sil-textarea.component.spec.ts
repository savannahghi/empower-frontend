import { SilFormTextareaComponent } from './sil-textarea.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('SilFormTextareaComponent', () => {
    let component: SilFormTextareaComponent;
    let fixture: ComponentFixture<SilFormTextareaComponent>;
    const onesixty =
        'asdfasfadfasdfasdfasdfasdfasdfasdfasdfasdfasdf' +
        'asdfasdfasdfasdfadsfasdfasdfasdfasdfasdfasdfas' +
        'dfasdfasdfadsfadsfasdfasdfasasdfasdasdfasdasdf' +
        'asdfadfasdfadsfasdfasd';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFormTextareaComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormTextareaComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should test onChange method', () => {
        component.addText('first_name');
        component.updateCounter();
        component.field.formControl.setValue(onesixty);
        component.updateCounter();
        component.setRemainingCharacters('123123');
        expect(component).toBeTruthy();
    });
});
