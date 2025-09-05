import { promises } from 'fs';
import { resolve } from 'path';

import { log } from '../main/log.js';
import { NWPlatform } from '../main/types.js';

const remove = async (
  platform: NWPlatform,
  cacheDir: string,
  downloadUrl: string
): Promise<void> => {
  try {
    if (downloadUrl === 'https://dl.nwjs.io/') {
      if (platform === 'linux') {
        await promises.unlink(resolve(cacheDir, 'nw.tar.gz'));
      } else {
        await promises.unlink(resolve(cacheDir, 'nw.zip'));
      }
    } else if (
      downloadUrl ===
      'https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download'
    ) {
      await promises.unlink(resolve(cacheDir, 'ffmpeg.zip'));
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { remove };
