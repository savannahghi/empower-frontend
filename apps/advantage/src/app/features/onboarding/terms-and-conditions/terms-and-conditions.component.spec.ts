import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

describe('TermsAndConditionsComponent', () => {
    let component: TermsAndConditionsComponent;
    let fixture: ComponentFixture<TermsAndConditionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TermsAndConditionsComponent],
            imports: [mockPipe('variantDisplay')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(TermsAndConditionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
