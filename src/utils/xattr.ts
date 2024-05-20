import { exec } from 'child_process';
import { resolve } from 'path';

import { log } from '../main/log';
import { NWArch, NWPlatform } from '../main/types';

export const xattr = (
  platform: NWPlatform,
  arch: NWArch,
  nwDir: string
): Promise<void> => {
  return new Promise<void>((res, rej) => {
    if (platform === 'osx' && arch === 'arm64') {
      const app = resolve(nwDir, 'nwjs.app');
      exec(`sudo xattr -d com.apple.quarantine ${app}`, (err, stdout) => {
        log.debug(stdout);
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    } else {
      res();
    }
  });
};
