const { OpenFgaClient, CredentialsMethod } = require('@openfga/sdk');
import * as express from 'express';
import * as functions from 'firebase-functions';

/**
 * Express Function for cloud function
 * @returns express function
 */
export function app(): express.Express {
    const server = express();
    const bodyParser = require('body-parser');
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(express.json());
    server.set('view engine', 'html');

    server.post('/api/login', async (req, res) => {
        const urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'password');
        urlencoded.append(
            'client_id',
            process.env.SSR_CLIENT_ID || ''
        );
        urlencoded.append(
            'client_secret',
            process.env.SSR_CLIENT_SECRET || ''
        );
        urlencoded.append('username', req.body.username);
        urlencoded.append('password', req.body.password);

        Object.assign(app, req.body);
        try {
            const response = await fetch(
                'https://accounts.multitenant.slade360.co.ke/oauth2/token/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: urlencoded,
                    redirect: 'follow',
                }
            );
            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    server.post('/api/features', async (req, res) => {
        const fgaClient = new OpenFgaClient({
            apiUrl: process.env.OPENFGA_API_URL || '',
            storeId: process.env.OPENFGA_STORE_ID || '',
            authorizationModelId: process.env.OPENFGA_AUTH_MODEL_ID || '',
            credentials: {
                method: CredentialsMethod.ApiToken,
                config: {
                    token: process.env.OPENFGA_API_TOKEN || '',
                },
            },
        });

        const options = {
            authorizationModelId: process.env.OPENFGA_AUTH_MODEL_ID || '',
        };

        try {
            const response = await fgaClient.listObjects(
                {
                    user: `user:${req.body.user_guid}`,
                    relation: 'can_access',
                    type: 'feature',
                },
                options
            );

            /** Check if organization has paid for the feature */
            if (
                Array.isArray(response.objects) &&
                response.objects.length === 0
            ) {
                const orgResponse = await fgaClient.listObjects(
                    {
                        user: `organization:${req.body.organization_guid}`,
                        relation: 'subscriber',
                        type: 'plan',
                    },
                    options
                );

                let result = {
                    message: 'the user has no permissions',
                    code: 403,
                };
                if (
                    Array.isArray(orgResponse.objects) &&
                    orgResponse.objects.length === 0
                ) {
                    // org has not paid for plan
                    result = {
                        message: 'organization has not paid for the product',
                        code: 402,
                    };

                    res.status(402).json(result); // 402 Payment Required
                } else {
                    res.status(403).json(result); // 403 Forbidden
                }
            } else {
                const items = response.objects;
                const output = [];

                for (const item of items) {
                    const value = item.split(':')[1] || '';
                    output.push(value);
                }
                res.json(output);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to fetch data',
                code: 500,
            });
        }
    });

    return server;
}

const server = app();

// Expose the Express app as a Firebase Function
exports.ssr = functions.https.onRequest(server);
