import { resolve } from 'path';

import Decompress from 'decompress';

import { log } from '../main/log';
import { NWPlatform } from '../main/types';

const decompress = async (
  platform: NWPlatform,
  cacheDir: string,
  downloadUrl: string
): Promise<void> => {
  try {
    if (
      downloadUrl === 'https://dl.nwjs.io' ||
      downloadUrl === 'https://npm.taobao.org/mirrors/nwjs' ||
      downloadUrl === 'https://npmmirror.com/mirrors/nwjs'
    ) {
      if (platform === 'linux') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await Decompress(resolve(cacheDir, 'nw.tar.gz'), cacheDir);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await Decompress(resolve(cacheDir, 'nw.zip'), cacheDir);
      }
    } else if (
      downloadUrl ===
      'https://github.com/corwin-of-amber/nw.js/releases/download'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await Decompress(resolve(cacheDir, 'nw.zip'), cacheDir);
    } else if (
      downloadUrl ===
      'https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await Decompress(resolve(cacheDir, 'ffmpeg.zip'), cacheDir);
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
