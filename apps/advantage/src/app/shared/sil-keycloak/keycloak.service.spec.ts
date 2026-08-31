import { TestBed } from '@angular/core/testing';
import { SilKeycloakService } from './keycloak.service';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

describe('SilKeycloakService', () => {
    let service: SilKeycloakService;
    let keycloakSpy: jasmine.SpyObj<KeycloakService>;

    beforeEach(() => {
        keycloakSpy = jasmine.createSpyObj('KeycloakService', [
            'updateToken',
            'getToken',
            'getKeycloakInstance',
            'isLoggedIn',
            'login',
            'loadUserProfile',
            'logout',
        ]);

        TestBed.configureTestingModule({
            providers: [
                SilKeycloakService,
                { provide: KeycloakService, useValue: keycloakSpy },
            ],
        });

        service = TestBed.inject(SilKeycloakService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should use keycloak service based on environment', () => {
        expect(service.useKeyCloakService).toBe(
            environment.authWithKeyCloak === 'true'
        );
    });

    it('should get token and store in localStorage', async () => {
        keycloakSpy.updateToken.and.returnValue(Promise.resolve(true));
        keycloakSpy.getToken.and.returnValue(Promise.resolve('test-token'));
        spyOn(localStorage, 'setItem');

        const token = await service.getToken();
        expect(token).toBe('test-token');
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'keycloak_token',
            'test-token'
        );
    });

    it('should return null if idToken is missing in getUserInfo', async () => {
        keycloakSpy.getKeycloakInstance.and.returnValue({ idToken: null });
        const userInfo = await service.getUserInfo();
        expect(userInfo).toBeNull();
    });

    it('should decode idToken and return user profile', async () => {
        const idToken = 'dummy.jwt.token';
        keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });

        const userInfo = await service.getUserInfo();
        expect(userInfo).toEqual(null);
    });

    it('should decode idToken and return user profile', async () => {
        const header = btoa(
            JSON.stringify({
                alg: 'RS256',
                typ: 'JWT',
                kid: '57zzLTZSJELIJxa5x2alaEXkXUM52ImWJVZ01Fz4b4A',
            })
        );
        const payload = btoa(
            JSON.stringify({
                exp: 1765306071,
                iat: 1765280871,
                sub: 'db715880-b0c5-4ce0-a0d3-9cfb21ccf60b',
                typ: 'Bearer',
                email_verified: true,
                name: 'Test User',
                preferred_username: 'test.user@example.com',
                given_name: 'Test',
                family_name: 'User',
                email: 'test.user@example.com',
                tenants: {
                    '1': { name: ['Test Organization'] },
                    '5113': {
                        name: ['Another Test Org'],
                        authserverBPGuid: [
                            'c716dc9f-523d-430e-8b34-a6f4ea5b7a5a',
                        ],
                    },
                },
            })
        );
        const idToken = `${header}.${payload}.fake-signature`;
        keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });

        let userInfo = await service.getUserInfo();
        expect(userInfo).toBeInstanceOf(Object);

        userInfo = await service.getUserInfo();
        expect(userInfo).toBeInstanceOf(Object);
    });

    it('should clear user profile cache', async () => {
        (service as any).userProfile = { email: 'a', full_name: 'b' };
        service.clearCache();
        expect((service as any).userProfile).toBeUndefined();
    });

    it('should return isLoggedIn value', async () => {
        keycloakSpy.isLoggedIn.and.returnValue(true);
        const loggedIn = await service.isLoggedIn();
        expect(loggedIn).toBeTrue();
    });

    it('should call login with redirectUri', async () => {
        keycloakSpy.login.and.returnValue(Promise.resolve());
        await service.login();
        expect(keycloakSpy.login).toHaveBeenCalledWith({
            redirectUri: environment.keycloak.redirectUri,
        });
    });

    it('should call loadUserProfile', async () => {
        keycloakSpy.loadUserProfile.and.returnValue(
            Promise.resolve({ name: 'test' })
        );
        const profile = await service.getUserProfile();
        expect(profile).toEqual({ name: 'test' });
    });

    it('should call logout with logoutRedirectUri', async () => {
        keycloakSpy.logout.and.returnValue(Promise.resolve());
        await service.logout();
        expect(keycloakSpy.logout).toHaveBeenCalledWith(
            environment.keycloak.logoutRedirectUri
        );
    });

    it('should return Bearer token in getAuthHeader', async () => {
        spyOn(service, 'getToken').and.returnValue(Promise.resolve('abc123'));
        const header = await service.getAuthHeader();
        expect(header).toBe('Bearer abc123');
    });

    it('should return empty string if token is null in getAuthHeader', async () => {
        spyOn(service, 'getToken').and.returnValue(
            Promise.resolve(null as any)
        );
        const header = await service.getAuthHeader();
        expect(header).toBe('');
    });

    it('should return empty string on error in getAuthHeader', async () => {
        spyOn(service, 'getToken').and.returnValue(Promise.reject('error'));
        const header = await service.getAuthHeader();
        expect(header).toBe('');
    });

    describe('getSelectedOrganisationId', () => {
        it('should return null if idToken is missing', async () => {
            keycloakSpy.getKeycloakInstance.and.returnValue({ idToken: null });
            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBeNull();
        });

        it('should return null if tenants is undefined', async () => {
            const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
            const payload = btoa(
                JSON.stringify({
                    given_name: 'John',
                    family_name: 'Doe',
                    email: 'john@example.com',
                })
            );
            const idToken = `${header}.${payload}.test`;
            keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });
            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBeNull();
        });

        it('should return null if tenants is empty object', async () => {
            const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
            const payload = btoa(
                JSON.stringify({
                    given_name: 'John',
                    family_name: 'Doe',
                    email: 'john@example.com',
                    tenants: {},
                })
            );
            const idToken = `${header}.${payload}.test`;
            keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });
            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBeNull();
        });

        it('should return the first tenant id from tenants object', async () => {
            const mockToken = {
                given_name: 'Jason',
                family_name: 'Wanjohi',
                email: 'jason.wanjohi@savannahinformatics.com',
                tenants: {
                    '1': {
                        name: ['Savannah Informatics Limited'],
                        id: 'e689d022-4649-499b-9b37-ef7e3af07448',
                    },
                },
            };
            const idToken =
                btoa(JSON.stringify({ alg: 'RS256' })) +
                '.' +
                btoa(JSON.stringify(mockToken)) +
                '.signature';
            keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });

            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBe('e689d022-4649-499b-9b37-ef7e3af07448');
        });

        it('should return the first tenant id when multiple tenants exist', async () => {
            const mockToken = {
                given_name: 'Jason',
                family_name: 'Wanjohi',
                email: 'jason.wanjohi@savannahinformatics.com',
                tenants: {
                    '1': {
                        name: ['Savannah Informatics Limited'],
                        id: 'e689d022-4649-499b-9b37-ef7e3af07448',
                    },
                    '5113': {
                        name: ['Oregon Health Services'],
                        id: 'c716dc9f-523d-430e-8b34-a6f4ea5b7a5a',
                    },
                },
            };
            const idToken =
                btoa(JSON.stringify({ alg: 'RS256' })) +
                '.' +
                btoa(JSON.stringify(mockToken)) +
                '.signature';
            keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });

            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBeTruthy();
            expect(typeof orgId).toBe('string');
        });

        it('should return null if tenant object has no id', async () => {
            const mockToken = {
                given_name: 'Jason',
                family_name: 'Wanjohi',
                email: 'jason.wanjohi@savannahinformatics.com',
                tenants: {
                    '1': {
                        name: ['Savannah Informatics Limited'],
                    },
                },
            };
            const idToken =
                btoa(JSON.stringify({ alg: 'RS256' })) +
                '.' +
                btoa(JSON.stringify(mockToken)) +
                '.signature';
            keycloakSpy.getKeycloakInstance.and.returnValue({ idToken });

            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBeNull();
        });

        it('should handle error when decoding token', async () => {
            const invalidToken = 'invalid.token.structure';
            keycloakSpy.getKeycloakInstance.and.returnValue({
                idToken: invalidToken,
            });
            spyOn(console, 'error');

            const orgId = await service.getSelectedOrganisationId();
            expect(orgId).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });
    });
});
