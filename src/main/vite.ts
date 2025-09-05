import { promises as fs } from 'fs';
import fsl from 'fs';
import path from 'path';
import { NWABConfig } from './types.js';
import { NWAB } from './index.js';

const packageJsonPath = path.resolve(process.cwd(), './public/package.json');
try {
    const packageJson = JSON.parse(fsl.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.main = 'index.html';
    fsl.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
    console.log(`[BUILD] Updated package.json main to: index.html`);
}
catch (e) {
    console.error('[BUILD ERROR] Failed to update package.json', e);
}

// --------------------------------------------------------------- //
export default function vitePluginNWAB(config: NWABConfig) {
    return {
        name: 'vite-plugin-nwab',

        async configureServer(server: any) {
            // Выполняется в dev-режиме после запуска dev-сервера
            server.httpServer?.on('listening', async () => {
                const address = `http://localhost:${server.config.server.port}`;
                console.log(`[DEV SERVER] Running at: ${address}`);

                try {
                    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
                    packageJson.main = address;
                    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
                    console.log(`[DEV] Updated package.json main to: ${address}`);
                }
                catch (e) {
                    console.error('[DEV ERROR] Failed to update package.json', e);
                }

                const Builder = new NWAB(config);

                try {
                    await Builder.run();
                    console.log('[DEV] Builder completed successfully');
                }
                catch (e) {
                    console.error('[DEV ERROR]', e);
                }
            });
        },

        async writeBundle() {
            // eslint-disable-next-line node/prefer-global/process
            if (process.env.NODE_ENV !== 'production')
                return;

            config.app.directory = './dist';
            const Builder = new NWAB(config);

            try {
                await Builder.run('build');
                console.log('[BUILD] Builder completed successfully');
            }
            catch (e) {
                console.error('[BUILD ERROR]', e);
            }
        },
    };
}
