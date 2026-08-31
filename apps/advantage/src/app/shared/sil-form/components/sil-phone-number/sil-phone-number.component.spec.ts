import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilPhoneNumberComponent } from './sil-phone-number.component';

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: [],
        };
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            country_code: 'KEN',
            user_workstations: [{ workstation: '1' }],
        };
    }
}

describe('SilPhoneNumberComponent', () => {
    let component: SilPhoneNumberComponent;
    let fixture: ComponentFixture<SilPhoneNumberComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [SilPhoneNumberComponent],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
            ],
        });
        fixture = TestBed.createComponent(SilPhoneNumberComponent);
        component = fixture.componentInstance;
        const formControl = new FormControl();
        formControl.setValue('+254700090954');
        spyOnProperty(component, 'formControl', 'get').and.returnValue(
            formControl
        );
        spyOnProperty(component, 'props', 'get').and.returnValue({
            required: true,
            noLabel: false,
            label: 'Phone Number',
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        component.onModelChange(null);
        component.onModelChange({
            number: '700090954',
            e164Number: '+254700090954',
        });
        expect(component).toBeTruthy();
    });
});
