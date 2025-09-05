import { platform } from 'process';
import * as fse from 'fs-extra';

import { log } from '../../main/log.js';
import { NWPropertiesLinux } from '../../main/types.js';
const { rename, writeFile } = fse;
export const setLinuxConfig = async (c: {
  properties: NWPropertiesLinux;
  name: string;
  version: string;
  icon?: string;
  outDir: string;
}): Promise<void> => {
  if (platform === 'win32') {
    log.warn(
      'Linux apps built on Windows platform do not preserve all file permissions. See #716'
    );
  }

  await rename(`${c.outDir}/nw`, `${c.outDir}/${c.name}`);
  if (Object.keys(c?.properties || {})?.length) {
    let fileContent = '[Desktop Entry]\n';
    for (const [key, val] of Object.entries(c.properties)) {
      fileContent += `${key}=${val}\n`;
      log.debug(`Add ${key}=${val} to Desktop Entry File`);
    }
    const filePath = `${c.outDir}/${c.name}.desktop`;
    await writeFile(filePath, fileContent);
    log.debug('Desktop Entry file generated');
  }
};
