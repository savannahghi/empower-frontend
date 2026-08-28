import { FormatBooleanPipe } from './format-boolean.pipe';

describe('FormatBooleanPipe', () => {
    let pipe: FormatBooleanPipe;

    beforeEach(() => {
        pipe = new FormatBooleanPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform true to "Active"', () => {
        const result = pipe.transform(true);
        expect(result).toBe('Active');
    });

    it('should transform false to "Inactive"', () => {
        const result = pipe.transform(false);
        expect(result).toBe('Inactive');
    });

    it('should return value if value passed is not a boolean', () => {
        const result = pipe.transform('not a boolean');
        expect(result).toBe('not a boolean');
    });
});
