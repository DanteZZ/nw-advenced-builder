import { arch as architecture } from 'process';

import { NWArch } from '../main/types.js';

export const getArch = (arch: string = architecture): NWArch => {
  switch (arch) {
    case 'ia32':
      return 'ia32';
    case 'x64':
      return 'x64';
    case 'arm64':
      return 'arm64';
    default:
      return arch as NWArch;
  }
};
