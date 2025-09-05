import fs from 'fs';
import { resolve } from 'path';
import fetch from 'node-fetch';
import progress from 'cli-progress';
import { NWArch, NWFlavor, NWPlatform } from '../main/types.js';

const bar = new progress.SingleBar({}, progress.Presets.rect);

export const download = async (
  version: string,
  flavor: NWFlavor,
  platform: NWPlatform,
  architecture: NWArch,
  downloadUrl: string,
  cacheDir: string
): Promise<void> => {
  let url: string;
  let out: string;

  if (
    downloadUrl === 'https://dl.nwjs.io' ||
    downloadUrl === 'https://npm.taobao.org/mirrors/nwjs' ||
    downloadUrl === 'https://npmmirror.com/mirrors/nwjs'
  ) {
    url = `${downloadUrl}/v${version}/nwjs${flavor === 'sdk' ? '-sdk' : ''}-v${version}-${platform}-${architecture}.${platform === 'linux' ? 'tar.gz' : 'zip'}`;
    out = resolve(cacheDir, `nw.${platform === 'linux' ? 'tar.gz' : 'zip'}`);
  } else if (downloadUrl === 'https://github.com/corwin-of-amber/nw.js/releases/download') {
    url = `${downloadUrl}/nw-v${version}/nwjs-${flavor === 'sdk' ? 'sdk-' : ''}v${version}-${platform}-${architecture}.zip`;
    out = resolve(cacheDir, 'nw.zip');
  } else if (downloadUrl === 'https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download') {
    url = `${downloadUrl}/${version}/${version}-${platform}-${architecture}.zip`;
    out = resolve(cacheDir, 'ffmpeg.zip');
  } else {
    throw new Error('Invalid download url. Please try again.');
  }

  console.log(`Downloading from ${url}`);

  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const total = Number(response.headers.get('content-length') || 0);
  if (total > 0) bar.start(total, 0);

  fs.mkdirSync(cacheDir, { recursive: true });
  const fileStream = fs.createWriteStream(out);

  return new Promise((resolvePromise, rejectPromise) => {
    let loaded = 0;
    if (response.body) {
      response.body.on('data', (chunk: Buffer) => {
        loaded += chunk.length;
        if (total > 0) bar.update(loaded);
      });

      response.body.on('error', err => rejectPromise(err));

      response.body.pipe(fileStream);

      fileStream.on('finish', () => {
        if (total > 0) bar.stop();
        resolvePromise();
      });

      fileStream.on('error', err => rejectPromise(err));
    } else {
      rejectPromise(`Unavailable url: ${url}`)
    }
  });
};
