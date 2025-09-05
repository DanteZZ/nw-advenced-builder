import { platform } from 'process';

import { NWPlatform } from '../main/types.js';

export const getPlatform = (plat: string = platform): NWPlatform => {
  switch (plat) {
    case 'darwin':
      return 'osx';
    case 'win32':
      return 'win';
    case 'linux':
      return 'linux';
    default:
      return plat as NWPlatform;
  }
};
