/**
 * defines form fields for logging in
 */
export const loginForm = [
    {
        key: 'email',
        type: 'input',
        props: {
            attributes: {
                autofocus: '',
                autocomplete: 'off',
            },
            type: 'email',
            label: 'EMAIL',
            pattern: '.+@.+..+',
            placeholder: 'Email address',
            required: true,
        },
    },
    {
        key: 'dummy',
        type: 'input',
        props: {
            hidden: true,
            type: 'password',
            required: false,
        },
    },
    {
        key: 'password',
        type: 'input',
        props: {
            attributes: {
                autocomplete: 'off',
            },
            type: 'password',
            label: 'PASSWORD',
            minLength: 8,
            placeholder: 'Password',
            required: true,
        },
    },
    {
        className: 'full-width',
        fieldGroup: [
            {
                key: 'remember_me',
                type: 'checkbox',
                className: 'flex',
                props: {
                    label: 'Remember me',
                    required: false,
                },
            },
            {
                type: 'template',
                props: {
                    link: '../forgot-password',
                    linkText: 'Forgot Password?',
                    customClass: 'float-right',
                },
            },
        ],
    },
];
