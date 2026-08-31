import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TosDocumentComponent } from './tos-document.component';

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

describe('TosDocumentComponent', () => {
    let component: TosDocumentComponent;
    let fixture: ComponentFixture<TosDocumentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TosDocumentComponent],
            imports: [mockPipe('variantDisplay')],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TosDocumentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
