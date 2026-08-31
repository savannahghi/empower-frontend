import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VariantPipe } from '../../@theme/pipes/variant/variant.pipe';
import { FeatureFlagService } from '../../@core/utils/feature.service';
import { VariantFlagCheckerDirective } from './advancedflagchecker.directive';
import { of } from 'rxjs';

const featureFlagServiceStub = {
    isFeatureOn: () => {
        return false;
    },
    flagsLoadedEmitter: of({
        featuresLoaded: true,
        featureFlags: {
            prov_hideVisitAmounts: {
                defaultValue: '!empower',
            },
        },
        growthbook: {
            evalFeature: () => {
                return {
                    value: '!empower',
                    source: 'defaultValue',
                    on: false,
                };
            },
            setFeatures: () => {},
        },
    }),
    featuresLoaded: true,
    featureFlags: {
        prov_hideVisitAmounts: {
            defaultValue: '!empower',
        },
    },
    growthbook: {
        evalFeature: () => {
            return {
                value: '!empower',
                source: 'defaultValue',
                on: false,
            };
        },
        setFeatures: () => {},
    },
};

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

class PipeStub {
    transform() {
        return true;
    }
}
describe('VariantFlagCheckerDirective: display element', () => {
    let service: FeatureFlagService;
    let variantPipe: VariantPipe;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('variant')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: FeatureFlagService,
                    useValue: featureFlagServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
        service.featuresLoaded = true;
        variantPipe = TestBed.inject(VariantPipe);
    });

    it('should test variantflag', () => {
        const elem = {
            nativeElement: {
                style: {
                    setProperty: () => {},
                },
                remove: () => {},
                attributes: {
                    variantflag: {
                        nodeValue: 'prov_hideVisitAmounts',
                    },
                },
            },
        };
        const directive = new VariantFlagCheckerDirective(
            elem,
            variantPipe,
            service
        );
        expect(directive).toBeTruthy();
        const elemVariant = {
            nativeElement: {
                style: {
                    setProperty: () => {},
                },
                remove: () => {},
                attributes: {
                    variantflag: {
                        nodeValue: undefined,
                    },
                },
            },
        };
        // test when this.variantflag
        const directive2 = new VariantFlagCheckerDirective(
            elemVariant,
            variantPipe,
            service
        );
        directive2.variantflag = 'prov_hideVisitAmounts';
        directive2.evaluateFlag();
        expect(directive2).toBeTruthy();
    });
});

const featureFlagServiceStub2 = {
    isFeatureOn: () => {
        return false;
    },
    flagsLoadedEmitter: of({
        featuresLoaded: true,
        featureFlags: {
            prov_hideVisitAmounts: {
                defaultValue: '!empower',
            },
        },
        growthbook: {
            evalFeature: () => {
                return {
                    value: '!empower',
                    source: 'defaultValue',
                    on: false,
                };
            },
            setFeatures: () => {},
        },
    }),
    featuresLoaded: true,
    featureFlags: {
        prov_hideVisitAmounts: {
            defaultValue: '!empower',
        },
    },
    growthbook: {
        evalFeature: () => {
            return {
                value: '!empower',
                source: 'defaultValue',
                on: false,
            };
        },
        setFeatures: () => {},
    },
};

class PipeStub2 {
    transform() {
        return false;
    }
}

describe('VariantFlagCheckerDirective: hide element', () => {
    let service: FeatureFlagService;
    let variantPipe: VariantPipe;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: FeatureFlagService,
                    useValue: featureFlagServiceStub2,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub2,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
        service.featuresLoaded = true;
        variantPipe = TestBed.inject(VariantPipe);
    });

    it('should test variantflagChecker', () => {
        const elem = {
            nativeElement: {
                parentNode: {
                    removeChild: () => {},
                },
                style: {
                    setProperty: () => {},
                },
                remove: () => {},
                attributes: {
                    variantflag: {
                        nodeValue: 'prov_hideVisitAmounts',
                    },
                },
            },
        };
        const directive = new VariantFlagCheckerDirective(
            elem,
            variantPipe,
            service
        );
        expect(directive).toBeTruthy();
    });
});

const featureFlagServiceStubForcedValue = {
    isFeatureOn: () => {
        return false;
    },
    flagsLoadedEmitter: of({
        featuresLoaded: true,
        featureFlags: {
            prov_hideVisitAmounts: {
                defaultValue: '!empower',
                rules: [
                    {
                        force: '!empower',
                    },
                ],
            },
        },
        growthbook: {
            evalFeature: () => {
                return {
                    value: '!empower',
                    source: 'force',
                    on: true,
                };
            },
            setFeatures: () => {},
        },
    }),
    featuresLoaded: true,
    featureFlags: {
        prov_hideVisitAmounts: {
            defaultValue: '!empower',
            rules: [
                {
                    force: '!empower',
                },
            ],
        },
    },
    growthbook: {
        evalFeature: () => {
            return {
                value: '!empower',
                source: 'force',
                on: true,
            };
        },
        setFeatures: () => {},
    },
};

describe('VariantFlagCheckerDirective: forced value', () => {
    let service: FeatureFlagService;
    let variantPipe: VariantPipe;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: FeatureFlagService,
                    useValue: featureFlagServiceStubForcedValue,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub2,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
        service.featuresLoaded = true;
        variantPipe = TestBed.inject(VariantPipe);
    });

    it('should test variantflagChecker with forced value', () => {
        const elem = {
            nativeElement: {
                parentNode: {
                    removeChild: () => {},
                },
                style: {
                    setProperty: () => {},
                },
                remove: () => {},
                attributes: {
                    variantflag: {
                        nodeValue: 'prov_hideVisitAmounts',
                    },
                },
            },
        };
        const directive = new VariantFlagCheckerDirective(
            elem,
            variantPipe,
            service
        );
        expect(directive).toBeTruthy();
    });
});

const featureFlagServiceStubNoFeature = {
    isFeatureOn: () => {
        return false;
    },
    flagsLoadedEmitter: of({
        featuresLoaded: true,
        featureFlags: {},
        growthbook: {
            evalFeature: () => {
                return {
                    value: undefined,
                    source: 'unknownFeature',
                    on: false,
                };
            },
            setFeatures: () => {},
        },
    }),
    featuresLoaded: true,
    featureFlags: {},
    growthbook: {
        evalFeature: () => {
            return {
                value: undefined,
                source: 'unknownFeature',
                on: false,
            };
        },
        setFeatures: () => {},
    },
};

describe('VariantFlagCheckerDirective: feature does not exist', () => {
    let service: FeatureFlagService;
    let variantPipe: VariantPipe;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: FeatureFlagService,
                    useValue: featureFlagServiceStubNoFeature,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
        service.featuresLoaded = true;
        variantPipe = TestBed.inject(VariantPipe);
    });

    it('should show element when feature does not exist (backward compatibility)', () => {
        const elem = {
            nativeElement: {
                style: {
                    setProperty: jasmine.createSpy('setProperty'),
                },
                remove: () => {},
                attributes: {
                    variantflag: {
                        nodeValue: 'nonexistent_feature',
                    },
                },
            },
        };
        const directive = new VariantFlagCheckerDirective(
            elem,
            variantPipe,
            service
        );
        expect(directive).toBeTruthy();
        expect(elem.nativeElement.style.setProperty).toHaveBeenCalledWith(
            'display',
            'flex',
            'important'
        );
    });
});
