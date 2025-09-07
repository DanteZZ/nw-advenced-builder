import path, { resolve } from 'path';
import * as fse from 'fs-extra';
import { promises as fsa } from 'fs';
import { log } from '../main/log.js';

import { compress } from './compress.js';
import { setWinConfig } from './configurators/win.js';
import { NWABConfig, NWPlatform } from '../main/types.js';
import { setLinuxConfig } from './configurators/linux.js';
import { setOsxConfig } from './configurators/osx.js';

const { copy, move, remove } = fse;
const { readFile, writeFile } = fsa;
export const build = async (
  bundleDir: string,
  nwDir: string,
  outDir: string,
  platform: NWPlatform,
  conf: NWABConfig
): Promise<void> => {
  log.debug(`Remove any files at ${outDir} directory`);
  await remove(outDir);
  log.debug(`Copy ${nwDir} files to ${outDir} directory`);
  await copy(nwDir, outDir);

  log.debug(`Copy files in srcDir to ${outDir} directory`);
  log.debug(
    `Generating "${platform !== 'osx' ? 'package.nw' : 'app.nw'}" archive`
  );

  const { name: verName, dir: dirName } = path.parse(outDir);

  await compress(resolve(bundleDir));

  await copy(
    resolve(bundleDir + '.zip'),
    resolve(dirName, 'packages', verName + '.nw')
  );

  log.debug(`moving "${platform !== 'osx' ? 'package.nw' : 'app.nw'}" archive`);

  await move(
    resolve(bundleDir + '.zip'),
    resolve(
      outDir,
      platform !== 'osx' ? 'package.nw' : 'nwjs.app/Contents/Resources/app.nw'
    )
  );

  let version;

  if (conf.app.version) {
    version = conf.app?.settings?.[platform]?.version || conf.app.version;
  } else {
    const pjs = JSON.parse(
      await readFile(resolve(bundleDir, 'package.json'), 'utf-8')
    );
    version = conf.app?.version || pjs?.version || '1.0.0';
  }

  await writeFile(resolve(dirName, 'packages/version'), version);
  if (platform !== 'osx') {
    await writeFile(resolve(outDir, 'version'), version);
  }

  log.debug(`Starting platform specific config steps for ${platform}`);
  switch (platform) {
    case 'win':
      await setWinConfig({
        properties: conf.app.settings?.[platform]?.properties || {},
        outDir,
        name: conf.app.settings?.win?.name || conf.app.name,
        icon: conf.app.settings?.win?.icon || conf.app.icon,
        version,
      });
      break;
    case 'linux':
      await setLinuxConfig({
        properties: conf.app.settings?.[platform]?.properties || {},
        outDir,
        name: conf.app.name,
        icon: conf.app.icon,
        version,
      });
      break;
    case 'osx':
      await setOsxConfig({
        outDir,
        name: conf.app.name,
        icon: conf.app.icon,
        version,
      });
      break;
    default:
      break;
  }

  if (conf.app.zip || conf.app.settings?.[platform]?.zip) {
    log.info('Compress build');
    await compress(outDir);
  }
};
