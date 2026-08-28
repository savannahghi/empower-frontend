import { FeatureFlagPipe } from './feature-flag.pipe';
import { environment } from '../../../../environments/environment';

describe('FeatureFlagPipe', () => {
    it('should return true when the environment.displayFeature variable is true', () => {
        const pipe = new FeatureFlagPipe();
        environment.displayFeature = 'true';
        const result = pipe.transform('');
        expect(result).toBe(true);
    });
    it('should return false when the environment.displayFeature variable is not set to true', () => {
        const pipe = new FeatureFlagPipe();
        environment.displayFeature = 'false';
        const result = pipe.transform('');
        expect(result).toBe(false);
    });
});
