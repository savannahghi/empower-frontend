import { TestBed } from '@angular/core/testing';
import { Setup } from '../setup.service';

describe('Setup service', () => {
    let setupService: Setup;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Setup],
        });
        setupService = TestBed.inject(Setup);
    });
    it('Service should be created', () => {
        const obj = {
            key: 'value',
            number: 1,
            boolean: true,
        };
        setupService.authStates = ['key', 'number', 'boolean'];
        const keyArray = ['key', 'number', 'boolean'];
        setupService.setFeatures(obj);
        setupService.setStates(obj);
        setupService.setStuff(keyArray, obj, obj);
        expect(setupService).toBeTruthy();
    });
});
