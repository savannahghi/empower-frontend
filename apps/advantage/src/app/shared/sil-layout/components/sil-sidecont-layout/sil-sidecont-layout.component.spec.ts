import { SilSidecontComponent } from './sil-sidecont-layout.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';

describe('SilSidecontComponent', () => {
    let component: SilSidecontComponent;
    let fixture: ComponentFixture<SilSidecontComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilSidecontComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilSidecontComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test setAmount method', () => {
        spyOn(component, 'setAmount').and.callThrough();
        const event = {
            availableLimit: 1000,
        };
        component.setAmount(event);
        expect(component).toBeTruthy();
        expect(component.setAmount).toHaveBeenCalledWith(event);
    });

    it('should test ngOnChanges method', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            payers: new SimpleChange(null, { length: {} }, false),
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should test ngOnChanges method', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.index = 1;
        component.ngOnChanges({
            index: new SimpleChange(null, {}, false),
        });
        fixture.detectChanges();
        expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should test ngOnChanges method', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            payers: new SimpleChange(null, { length: null }, false),
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should test ngOnChanges method', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            itemCount: new SimpleChange(null, {}, false),
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });
});
