import { StatusDescriptionPipe } from './status-description.pipe';

describe('StatusDescriptionPipe', () => {
    it('create an instance', () => {
        const pipe = new StatusDescriptionPipe();
        // service request tests
        let result = pipe.transform('PENDING', 'serviceRequest');
        expect(result).toBe(
            'The patient has not been added into this queue yet'
        );
        result = pipe.transform('COMPLETED', 'serviceRequest');
        expect(result).toBe('The patient has received service from this point');
        result = pipe.transform('WAITING', 'serviceRequest');
        expect(result).toBe('The is in the queue waiting to be seen');
        result = pipe.transform('IN_PROGRESS', 'serviceRequest');
        expect(result).toBe('The patient is currently being offered a service');
        result = pipe.transform('ENTERED_IN_ERROR', 'serviceRequest');
        expect(result).toBe('The patient was added to the queue by mistake');
        result = pipe.transform('RANDOM', 'serviceRequest');
        expect(result).toBe('');

        // visit tests
        result = pipe.transform('ARRIVED', 'visit');
        expect(result).toBe(
            'The patient is within the facility and is ready to receive a service'
        );
        result = pipe.transform('IN_PROGRESS', 'visit');
        expect(result).toBe(
            'The patient has committed funds for a service or more within this visit'
        );
        result = pipe.transform('FINISHED', 'visit');
        expect(result).toBe('The patient was done with this visit');
        result = pipe.transform('CANCELLED', 'visit');
        expect(result).toBe(`The patient's visit was cancelled`);
        result = pipe.transform('RANDOM', 'visit');
        expect(result).toBe('');

        // visit billing class tests
        result = pipe.transform('CASH', 'billing');
        expect(result).toBe('The patient has to pay upfront for services');
        result = pipe.transform('', 'billing');
        expect(result).toBe(
            'The patient may receive services before paying for them'
        );
    });
});
