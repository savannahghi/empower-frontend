import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { DeleteAccountComponent } from './delete-account.component';
import {
    NbCardModule,
    NbInputModule,
    NbStatusService,
    NbButtonModule,
    NbFocusMonitor,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

class NbStatusServiceStub {
    isCustomStatus() {}
    monitor() {
        return of(() => {});
    }
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    close() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

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

describe('DeleteAccountComponent', () => {
    let component: DeleteAccountComponent;
    let fixture: ComponentFixture<DeleteAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [DeleteAccountComponent],
            providers: [
                { provide: NbFocusMonitor, useClass: NbStatusServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
            imports: [
                FormsModule,
                NbCardModule,
                NbInputModule,
                NbButtonModule,
                mockPipe('variantDisplay'),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteAccountComponent);
        component = fixture.componentInstance;
        const assignSpy = jasmine.createSpy();
        component.window = {
            location: {
                assign: assignSpy,
            },
        };
        fixture.detectChanges();
    });

    it('should test component', () => {
        spyOn(component, 'assignToWindow').and.callThrough();
        component.sendEmail();
        expect(component.assignToWindow).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });
});
