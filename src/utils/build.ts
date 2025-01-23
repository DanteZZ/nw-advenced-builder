import path, { resolve } from 'path';
import { copy, rm, rename, readFile, writeFile } from 'fs-extra';

import { log } from '../main/log';

import { compress } from './compress.js';
import { setWinConfig } from './configurators/win';
import { NWABConfig, NWPlatform } from '../main/types';
import { setLinuxConfig } from './configurators/linux';
import { setOsxConfig } from './configurators/osx';

export const build = async (
  bundleDir: string,
  nwDir: string,
  outDir: string,
  platform: NWPlatform,
  conf: NWABConfig
): Promise<void> => {
  log.debug(`Remove any files at ${outDir} directory`);
  await rm(outDir, { force: true, recursive: true });
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

  await rename(
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
    version = pjs?.version || '1.0.0';
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
  };
};
