import { EntryTypePipe } from './entry-type.pipe';

describe('EntryTypePipe', () => {
    let pipe: EntryTypePipe;

    beforeEach(() => {
        pipe = new EntryTypePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform cr to debit', () => {
        const result = pipe.transform('cr');
        expect(result).toBe('Credit');
    });

    it('should transform dr to debit', () => {
        const result = pipe.transform('dr');
        expect(result).toBe('Debit');
    });
});
