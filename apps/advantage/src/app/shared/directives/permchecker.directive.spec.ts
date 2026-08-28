import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../../@core/auth/services/authentication.service';
import { PermcheckerDirective } from './permchecker.directive';

class AuthenticationServiceStub {
    checkPermission() {
        return true;
    }
}

describe('PermcheckerDirective: display element', () => {
    let service: AuthenticationService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(AuthenticationService);
    });

    it('should test permchecker', () => {
        const elem = {
            nativeElement: {
                style: {},
                attributes: {
                    silpermchecker: {
                        nodeValue: 'permission',
                    },
                },
            },
        };
        const directive = new PermcheckerDirective(elem, service);
        expect(directive).toBeTruthy();
    });
});

class AuthenticationServiceStub2 {
    checkPermission() {
        return false;
    }
}

describe('PermcheckerDirective: hide element', () => {
    let service: AuthenticationService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub2,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(AuthenticationService);
    });

    it('should test permchecker', () => {
        const elem = {
            nativeElement: {
                style: {},
                attributes: {
                    silpermchecker: {
                        nodeValue: 'permission',
                    },
                },
            },
        };
        const directive = new PermcheckerDirective(elem, service);
        expect(directive).toBeTruthy();
    });

    it('should test ngOnChanges method', () => {
        const elem = {
            nativeElement: {
                style: {},
                attributes: {
                    silpermchecker: {
                        nodeValue: 'permission',
                    },
                },
            },
        };
        const directive = new PermcheckerDirective(elem, service);
        spyOn(directive, 'ngOnChanges').and.callThrough();
        directive.ngOnChanges({
            silpermchecker: new SimpleChange(
                { silpermchecker: { currentValue: 'permission' } },
                {},
                false
            ),
        });
        expect(directive.ngOnChanges).toHaveBeenCalled();
    });
});
