import { inject, NgModule } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {
    ApolloClientOptions,
    ApolloLink,
    from,
    InMemoryCache,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

/** URL of the GraphQL serve */
const baseUri = environment.clinicalServerURL;

const USER_CLINICAL_IDS = 'auth.config.clinicalIds';

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = ` ${
        JSON.parse(localStorage.getItem('KEYCLOAK_IDENTITY')).access_token
    }`;
    const clinicalIds = JSON.parse(localStorage.getItem(USER_CLINICAL_IDS));
    const clinicalOrgId = clinicalIds.clinical_org_id;
    const clinicalFacilityId = clinicalIds.clinical_facility_id;

    operation.setContext({
        headers: {
            accept: 'charset=utf-8',
            authorization: `Bearer ${token}`,
            'Clinical-Organization-ID': clinicalOrgId,
            'Clinical-Facility-ID': clinicalFacilityId,
        },
    });

    return forward(operation);
});

// Log any GraphQL errors or network error that occurred

const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors)
            graphQLErrors.forEach(() => {
                return forward(operation);
            });
        if (networkError) return forward(operation);
    }
);

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    return {
        link: ApolloLink.from([
            errorLink,
            authMiddleware,
            httpLink.create({ uri: baseUri }),
        ]),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                // fetchPolicy: 'network-only',
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'all',
            },
            query: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all',
            },
        },
    };
}

@NgModule({
    exports: [],
    imports: [],
    providers: [
        provideApollo(() => {
            const httpClient = inject(HttpClient);
            const httpLink = new HttpLink(httpClient).create({
                uri: baseUri,
            });
            const link = from([authMiddleware, errorLink, httpLink]);
            return {
                cache: new InMemoryCache(),
                link: link,
                defaultOptions: {
                    watchQuery: {
                        // fetchPolicy: 'network-only',
                        fetchPolicy: 'cache-and-network',
                        errorPolicy: 'all',
                    },
                    query: {
                        fetchPolicy: 'network-only',
                        errorPolicy: 'all',
                    },
                    mutate: {
                        errorPolicy: 'all',
                    },
                },
            };
        }),
    ],
})
export class SilGraphQlModule {}
