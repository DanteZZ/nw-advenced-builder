import { get } from 'https';
import { log } from '../main/log.js';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getManifest = (manifestUrl: string): Promise<any> => {
  let chunks: any[] = [];

  return new Promise((resolve, reject) => {
    get(manifestUrl, res => {
      res.on('data', chunk => {
        chunks += chunk;
      });

      res.on('error', e => {
        log.error(e);
        reject(undefined);
      });

      res.on('end', () => {
        log.debug('Succesfully cached manifest metadata');
        resolve(chunks);
      });
    });
  });
};
