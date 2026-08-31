import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestsComponent } from './interests.component';

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

describe('InterestsComponent', () => {
    let component: InterestsComponent;
    let fixture: ComponentFixture<InterestsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InterestsComponent],
            imports: [mockPipe('variantDisplay')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(InterestsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
