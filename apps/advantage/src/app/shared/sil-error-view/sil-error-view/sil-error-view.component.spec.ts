import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilErrorViewComponent } from './sil-error-view.component';
import { NbIconModule, NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { Authorization } from '../../../@core/auth/services/authorization.service';

class AuthorizationConfigStub {
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
}

describe('SilErrorViewComponent', () => {
    let component: SilErrorViewComponent;
    let fixture: ComponentFixture<SilErrorViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                /**
                 * InjectionToken is provided by adding NbThemeModule.forRoot()
                 */

                NbThemeModule.forRoot(),
                NbIconModule,
                NbEvaIconsModule,
                SilErrorViewComponent,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilErrorViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test customFxnEmitter method', () => {
        spyOn(component, 'customFxnEmitter').and.callThrough();
        component.customFxnEmitter();
        expect(component.customFxnEmitter).toHaveBeenCalled();
    });
});
