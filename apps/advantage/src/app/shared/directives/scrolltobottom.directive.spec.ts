import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollToBottomDirective } from './scrolltobottom.directive';

describe('ScrollToBottomDirective:', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    it('should test automatic scroll', () => {
        const elem = {
            nativeElement: {
                scrollHeight: 100,
                offsetHeight: 20,
            },
        };
        const directive = new ScrollToBottomDirective(elem);
        spyOn(directive, 'scrollToBottom').and.callThrough();
        directive.scrollToBottom();
        expect(directive.scrollToBottom).toHaveBeenCalled();
        expect(directive).toBeTruthy();
    });
});
