import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { SilButtonGroupComponent } from './sil-button-group.component';

describe('SilButtonGroupComponent', () => {
    let component: SilButtonGroupComponent;
    let fixture: ComponentFixture<SilButtonGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilButtonGroupComponent],
            imports: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(SilButtonGroupComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            attributes: {},
            buttons: [],
        });
        const formControl = new FormControl();
        formControl.setValue('1');
        spyOnProperty(component, 'formControl', 'get').and.returnValue(
            formControl
        );
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        component.selectOption('Yes');
        component.updateSingleSelectGroupValue(['Yes']);
        expect(component).toBeTruthy();
    });
});
