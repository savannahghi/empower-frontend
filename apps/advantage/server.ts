import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import AppServerModule from './src/main.server';
import { environment } from './src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const bodyParser = require('body-parser');
    const distFolder = join(process.cwd(), 'dist/advantage/browser');
    const indexHtml = existsSync(join(distFolder, 'index.original.html'))
        ? join(distFolder, 'index.original.html')
        : join(distFolder, 'index.html');

    const commonEngine = new CommonEngine();
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(express.json());
    server.set('view engine', 'html');
    server.set('views', distFolder);

    // Example Express Rest API endpoints
    server.get(
        '*.*',
        express.static(distFolder, {
            maxAge: '1y',
        })
    );

    server.post('/api/login', async (req, res) => {
        const urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'password');
        urlencoded.append(
            'client_id',
            'PiL6uGmnhpYfqFGXHSGCAPDCceNYVNfMJWe5ds9G'
        );
        urlencoded.append(
            'client_secret',
            'pf3ImPMNIaF9iLC2YfYzLfueoofEo0ICuWZOZHxFvpZh5nkjNvryBO8I91qrckIsLeGHw1Z4edMkGsVaRUhcwoZXSALmbnk8CdcPafh33IJ1Q9z7i7MwlDP9lrT23RBq'
        );
        urlencoded.append('username', req.body.username);
        urlencoded.append('password', req.body.password);

        Object.assign(app, req.body);
        try {
            const response = await fetch(
                `${environment.AUTH_SERVER_DOMAIN}/oauth2/token/`,
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
            const token = data;
            delete token.refresh_token;
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    server.post('/api/find_auth', async (req, res) => {
        res.json(`${environment.AUTH_SERVER_DOMAIN}/reset_password/?next=/`);
        try {
            res.json(
                `${environment.AUTH_SERVER_DOMAIN}/reset_password/?next=/`
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    // All regular routes use the Angular engine
    server.get('*', (req, res, next) => {
        commonEngine
            .render({
                bootstrap: AppServerModule,
                documentFilePath: indexHtml,
                publicPath: distFolder,
                providers: [
                    {
                        provide: APP_BASE_HREF,
                        useValue: req.baseUrl,
                    },
                    {
                        provide: 'REQUEST',
                        useValue: req,
                    },
                    {
                        provide: 'RESPONSE',
                        useValue: res,
                    },
                ],
            })
            .then(html => res.send(html))
            .catch(err => next(err));
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.info(
            `Node Express server listening on http://localhost:${port}`
        );
    });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    run();
}

export default AppServerModule;
