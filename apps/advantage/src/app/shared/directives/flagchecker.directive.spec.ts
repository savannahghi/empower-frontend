import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from '../../@core/utils/feature.service';
import { FlagCheckerDirective } from './flagchecker.directive';

class FeatureFlagServiceStub {
    getForcedValue() {
        return true;
    }
    featuresLoaded: true;
}

describe('FlagCheckerDirective: display element', () => {
    let service: FeatureFlagService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
        service.featuresLoaded = true;
    });

    it('should test permchecker', () => {
        const elem = {
            nativeElement: {
                style: {},
                attributes: {
                    removeIfFeatureOff: {
                        nodeValue: 'permission',
                    },
                },
            },
        };
        const directive = new FlagCheckerDirective(elem, service);
        expect(directive).toBeTruthy();
    });
});

class FeatureFlagServiceStub2 {
    getForcedValue() {
        return false;
    }
    featuresLoaded: true;
}

describe('FlagCheckerDirective: hide element', () => {
    let service: FeatureFlagService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub2,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
        service.featuresLoaded = true;
    });

    it('should test removeIfFeatureOff', () => {
        const elem = {
            nativeElement: {
                parentNode: {
                    removeChild: () => {},
                },
                style: {},
                attributes: {
                    removeIfFeatureOff: {
                        nodeValue: 'permission',
                    },
                },
            },
        };
        const directive = new FlagCheckerDirective(elem, service);
        expect(directive).toBeTruthy();
    });

    it('should test ngOnChanges method', () => {
        const elem = {
            nativeElement: {
                style: {},
                attributes: {
                    removeIfFeatureOffChecker: {
                        nodeValue: 'permission',
                    },
                },
            },
        };
        const directive = new FlagCheckerDirective(elem, service);
        spyOn(directive, 'ngOnChanges').and.callThrough();
        directive.ngOnChanges({
            removeIfFeatureOffChecker: new SimpleChange(
                { removeIfFeatureOffChecker: { currentValue: 'permission' } },
                {},
                false
            ),
        });
        expect(directive.ngOnChanges).toHaveBeenCalled();
    });
});
