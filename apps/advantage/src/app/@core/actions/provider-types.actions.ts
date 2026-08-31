/**
 * Contains provider actions
 */
export const PROVIDER_TYPES_ACTIONS = {
    'PROVIDERS.VIEW': {
        description: 'View providers and provider panels.',
        perm: 'integration.membership.provider_list',
    },
    'PROVIDERS.CREATE': {
        description: 'Create providers and provider panels.',
        perm: 'integration.membership.provider_create',
    },
    'PROVIDERS.EDIT': {
        description: 'Edit providers and provider panels.',
        perm: 'integration.membership.provider_edit',
    },
    'PROVIDERS.DELETE': {
        description: 'Delete providers and provider panels.',
        perm: 'integration.membership.provider_delete',
    },
};
