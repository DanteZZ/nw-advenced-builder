import fs from 'fs';
import archiver from 'archiver';
import { log } from '../main/log';

/**
 * Compress a out directory
 *
 * @param  {string}             outDir  - Output directory
 * @param  {string}             type    - Compression type
 * @return {Promise<undefined>}
 */
const compress = (outDir: string, type = 'zip'): Promise<void> => {
  const output = fs.createWriteStream(`${outDir}.${type}`);
  const archive = archiver('zip');

  return new Promise<void>((res, rej) => {
    output.on('close', () => {
      res();
    });

    archive.on('warning', err => {
      if (err.code === 'ENOENT') {
        log.debug(err);
      } else {
        rej(err);
      }
    });

    archive.on('error', err => {
      rej(err);
    });

    archive.pipe(output);
    archive.directory(outDir, false);
    archive.finalize();
  });
};

export { compress };
