import { VitalStatusPipe } from './vital-status.pipe';

describe('VitalStatusPipe', () => {
    it('create an instance', () => {
        const pipe = new VitalStatusPipe();
        expect(pipe).toBeTruthy();
    });

    it('test vital display color', () => {
        const pipe = new VitalStatusPipe();
        const res = pipe.transform('Very High');
        expect(res).toBe('#e10000');
        let result = pipe.transform('Low');
        expect(result).toBe('#ea9326');
        result = pipe.transform(undefined);
        expect(result).toBe('');
        result = pipe.transform('');
        expect(result).toBe('green');
    });
});
