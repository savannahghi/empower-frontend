import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSystemsComponent } from './general-systems.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('GeneralSystemsComponent', () => {
    let component: GeneralSystemsComponent;
    let fixture: ComponentFixture<GeneralSystemsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [GeneralSystemsComponent],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralSystemsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
