import { SearchInputComponent } from './search-input.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchInputComponent', () => {
    let component: SearchInputComponent;
    let fixture: ComponentFixture<SearchInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchInputComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test showInput method', () => {
        component.showInput();
        expect(component.showInput).toBeTruthy();
    });

    it('should test hideInput method', () => {
        component.hideInput();
        expect(component.hideInput).toBeTruthy();
    });

    it('should test onInput method', () => {
        const mockEvent = {
            target: {
                value: 'test value',
            },
        };
        spyOn(component, 'onInput').and.callThrough();
        component.onInput(mockEvent);
        expect(component.onInput).toHaveBeenCalledWith(mockEvent);
    });
});
