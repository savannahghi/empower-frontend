import { TestBed } from '@angular/core/testing';
import { EditSegmentMessageService } from './edit-segment-message-form';

describe('EditSegmentMessageService', () => {
    let service: EditSegmentMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditSegmentMessageService);
    });

    it('should return the correct template from the model', () => {
        const field = {
            model: {
                message: {
                    template: 'Test Message',
                },
            },
        };

        const expression = service.fields().find(f => f.key === 'template')
            .expressions['model.template'];
        const result = expression(field);

        expect(result).toBe('Test Message');
    });

    it('should return the correct template_en from the model', () => {
        const field = {
            model: {
                message: {
                    template_en: 'Test Message in English',
                },
            },
        };

        const expression = service.fields().find(f => f.key === 'template_en')
            .expressions['model.template_en'];
        const result = expression(field);

        expect(result).toBe('Test Message in English');
    });

    it('should return the correct template_sw from the model', () => {
        const field = {
            model: {
                message: {
                    template_sw: 'Test Message in Swahili',
                },
            },
        };

        const expression = service.fields().find(f => f.key === 'template_sw')
            .expressions['model.template_sw'];
        const result = expression(field);

        expect(result).toBe('Test Message in Swahili');
    });

    it('should return the correct template_fr from the model', () => {
        const field = {
            model: {
                message: {
                    template_fr: 'Test Message in French',
                },
            },
        };

        const expression = service.fields().find(f => f.key === 'template_fr')
            .expressions['model.template_fr'];
        const result = expression(field);

        expect(result).toBe('Test Message in French');
    });

    it('should set the component instance correctly', () => {
        const mockComponent = { id: 1, name: 'TestComponent' };
        service.setComponent(mockComponent);
        expect(service.component).toBe(mockComponent);
    });
});
