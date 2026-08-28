import { AppPipe } from './app.pipe';
import { UIRouterGlobals, StateObject } from '@uirouter/core';

describe('AppPipe', () => {
    const uiglobals = new UIRouterGlobals();
    uiglobals.$current = StateObject.create({ name: 'app.healthcrm' });
    it('should return true when the input state is the current state', () => {
        const inputState = 'app.healthcrm';
        const pipe = new AppPipe(uiglobals);
        const result = pipe.transform(inputState);
        expect(result).toBe(true);
    });

    it('should return false when the input state is not the current state', () => {
        const inputState = 'currentStateB';
        const pipe = new AppPipe(uiglobals);
        const result = pipe.transform(inputState);
        expect(result).toBe(false);
    });
});
