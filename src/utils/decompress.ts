import { resolve } from 'path';
import { copyFileSync } from 'fs';
import Decompress from 'decompress';

import { log } from '../main/log.js';
import { NWPlatform } from '../main/types.js';

const decompress = async (
  platform: NWPlatform,
  cacheDir: string,
  downloadUrl: string,
  nwDir?: string // добавляем путь до установленного NW.js
): Promise<void> => {
  try {
    if (
      downloadUrl === 'https://dl.nwjs.io' ||
      downloadUrl === 'https://npm.taobao.org/mirrors/nwjs' ||
      downloadUrl === 'https://npmmirror.com/mirrors/nwjs'
    ) {
      if (platform === 'linux') {
        await Decompress(resolve(cacheDir, 'nw.tar.gz'), cacheDir);
      } else {
        await Decompress(resolve(cacheDir, 'nw.zip'), cacheDir);
      }
    } else if (downloadUrl === 'https://github.com/corwin-of-amber/nw.js/releases/download') {
      await Decompress(resolve(cacheDir, 'nw.zip'), cacheDir);
    } else if (downloadUrl === 'https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download') {
      const ffmpegDir = resolve(cacheDir, 'ffmpeg-unpacked');
      await Decompress(resolve(cacheDir, 'ffmpeg.zip'), ffmpegDir);

      if (nwDir) {
        let src: string;
        let dest: string;

        if (platform === 'win') {
          src = resolve(ffmpegDir, 'ffmpeg.dll');
          dest = resolve(nwDir, 'ffmpeg.dll');
        } else if (platform === 'osx') {
          src = resolve(ffmpegDir, 'libffmpeg.dylib');
          dest = resolve(nwDir, 'nwjs.app/Contents/Frameworks/nwjs Framework.framework/Libraries/libffmpeg.dylib');
        } else {
          // linux
          src = resolve(ffmpegDir, 'libffmpeg.so');
          dest = resolve(nwDir, 'libffmpeg.so');
        }
        console.log(src, dest);
        copyFileSync(src, dest);
        log.info(`Installed ffmpeg to ${dest}`);
      }
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
