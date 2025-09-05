import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { log } from '../main/log.js';

const execute = (
  srcDir: string,
  nwPath: string,
  argv: string
): Promise<ChildProcessWithoutNullStreams> => {
  return new Promise((resolve, reject) => {
    // It is assumed that the first glob pattern p contains the package.json at p/package.json
    srcDir = srcDir.split(' ')[0];
    srcDir = srcDir.replace(/\*[/*]*/, '');
    const nwProcess = spawn(nwPath, [srcDir.concat(argv)], {
      detached: true,
      windowsHide: false,
    });

    resolve(nwProcess);

    nwProcess.on('error', error => {
      log.error(error);
      reject(error);
    });
  });
};

export { execute };
