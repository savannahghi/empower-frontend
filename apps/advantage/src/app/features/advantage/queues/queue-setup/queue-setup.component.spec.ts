import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { QueueSetupComponent } from './queue-setup.component';

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

describe('QueueSetupComponent', () => {
    let component: QueueSetupComponent;
    let fixture: ComponentFixture<QueueSetupComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [QueueSetupComponent],
            imports: [mockPipe('translate')],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueSetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
