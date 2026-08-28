import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { MedicationRequestComponent } from './medication-request.component';
import { NbThemeModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { UIRouterGlobals } from '@uirouter/angular';

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

const uIRouterGlobalsStub = {
    params: {
        id: 'dummyId',
    },
};

describe('MedicationRequestComponent', () => {
    let component: MedicationRequestComponent;
    let fixture: ComponentFixture<MedicationRequestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                /**
                 * InjectionToken is provided by adding NbThemeModule.forRoot()
                 */
                mockPipe('titleCase'),
                mockPipe('statusColor'),
                NbThemeModule.forRoot(),
                CommonModule,
                MedicationRequestComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MedicationRequestComponent);
        component = fixture.componentInstance;
        component.badgeColors = {
            complete: {
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            pending: {
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
        };
        fixture.detectChanges();
    });

    it('should test the getBadgeStyle function', () => {
        spyOn(component, 'getBadgeStyle').and.callThrough();
        component.getBadgeStyle('complete');
        expect(component.getBadgeStyle).toHaveBeenCalled();
    });

    it('should test the returnBack function', () => {
        spyOn(component, 'returnBack').and.callThrough();
        component.returnBack();
        expect(component.returnBack).toHaveBeenCalled();
    });
});
