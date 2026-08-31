import { RemoveUnderScorePipe } from './remove-underscore.pipe';

describe('RemoveUnderScorePipe', () => {
    it('create an instance', () => {
        const pipe = new RemoveUnderScorePipe();
        let result = pipe.transform('hello_world');
        expect(result).toBe('hello world');
        result = pipe.transform(1);
        expect(result).toBe(1);
    });
});
