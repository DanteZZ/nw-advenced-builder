import { rename } from 'fs-extra';
import { resolve } from 'path';

import rcedit from 'rcedit';

import { log } from '../../main/log';
import { NWPropertiesWin } from '../../main/types';

const setWinConfig = async (c: {
  properties: NWPropertiesWin;
  name: string;
  version: string;
  icon?: string;
  outDir: string;
}): Promise<void> => {
  try {
    const outDirAppExe = resolve(c.outDir, `${c.name}.exe`);
    await rename(resolve(c.outDir, 'nw.exe'), outDirAppExe);
    await rcedit(outDirAppExe, {
      'file-version': c.version,
      icon: c.icon,
      'product-version': c.version,
      'version-string': {
        ProductVersion: c.version,
        ...(c?.properties || {}),
      },
    });
  } catch (error) {
    log.warn(
      "Renaming EXE failed or unable to modify EXE. If it's the latter, ensure WINE is installed or build in Windows"
    );
    log.error(error);
  }
};

export { setWinConfig };
