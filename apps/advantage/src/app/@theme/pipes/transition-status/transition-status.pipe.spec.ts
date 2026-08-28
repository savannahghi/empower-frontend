import { TransitionStatusPipe } from './transition-status.pipe';

describe('TransitionStatusPipe', () => {
    it('create an instance', () => {
        const pipe = new TransitionStatusPipe();
        expect(pipe).toBeTruthy();
    });

    it('test transitions', () => {
        const pipe = new TransitionStatusPipe();
        const res = pipe.transform('WAITING');
        expect(res).toBe('IN_PROGRESS');
        let result = pipe.transform('PENDING');
        expect(result).toBe('WAITING');
        result = pipe.transform('IN_PROGRESS');
        expect(result).toBe('COMPLETED');
        result = pipe.transform('ENTERED_IN_ERROR');
        expect(result).toBe('ENTERED_IN_ERROR');
        result = pipe.transform('');
        expect(result).toBe('');
    });
});
