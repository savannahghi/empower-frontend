import { ConsentColorPipe } from './consent-color.pipe';

describe('ConsentColorPipe', () => {
    it('create an instance', () => {
        const pipe = new ConsentColorPipe();
        expect(pipe).toBeTruthy();
    });

    it('test status color intention', () => {
        const pipe = new ConsentColorPipe();
        const res = pipe.transform(true);
        expect(res).toBe('success');
        const result = pipe.transform('');
        expect(result).toBe('basic');
    });
});
