import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

import { SilFormActionComponent } from './sil-form-action.component';

describe('SilFormActionComponent', () => {
    let component: SilFormActionComponent;
    let fixture: ComponentFixture<SilFormActionComponent>;

    class AuthenticationServiceStub {
        checkPermission() {
            return false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormActionComponent],
            providers: [
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormActionComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            buttonText: 'Waive',
            buttonType: 'button',
        });
        spyOnProperty(component, 'formControl', 'get');
        fixture.detectChanges();
    });

    it('should create', fakeAsync(() => {
        component.onClick();
        tick(1100);
        expect(component).toBeTruthy();
    }));
});
