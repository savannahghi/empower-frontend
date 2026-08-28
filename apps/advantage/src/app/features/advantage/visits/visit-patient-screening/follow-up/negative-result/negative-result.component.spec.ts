import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeResultComponent } from './negative-result.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';

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
describe('NegativeResultComponent', () => {
    let component: NegativeResultComponent;
    let fixture: ComponentFixture<NegativeResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NegativeResultComponent],
            imports: [mockPipe('titleCase')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(NegativeResultComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';
        component.pageText = {
            cervical: {
                label: 'negative',
                result: 'at risk ',
                text: 'The test results are ',
                text1: ' but the patient is still',
                text2: 'for HPV that causes cervical cancer. The next steps would be to:',
                action1:
                    'Educate the patient on what it means to be at risk yet have negative test results.',
                action2:
                    'Request them to return for screening after 5 years or after 2 years if HIV positive',
            },
            breast: {
                label: 'normal',
                result: ' high risk ',
                text: 'The screening results are ',
                text1: ' but the patient is still at',
                text2: ' for breast cancer. The next steps would be to:',
                action1:
                    'Educate the patient on what it means to be at high risk yet have normal screening results.',
                action2:
                    'Request them to return for screening every 6 to 12 months if they are 25 years or older.',
            },
        };
        fixture.detectChanges();
    });

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });
});
