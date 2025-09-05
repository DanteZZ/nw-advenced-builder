import { promises } from 'fs';
import { resolve } from 'path';

import { getManifest } from './getManifest.js';
import { NWArch, NWPlatform } from '../main/types.js';
import { log } from '../main/log.js';

/**
 * Get version specific release metadata
 *
 * @param  {string} version      NW version
 * @param  {string} platform     NW platform
 * @param  {string} arch         NW architecture
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @return {object}              Version specific release info
 */

interface iManifestRelease {
  version: string;
  files: string[];
}

interface iManifest {
  versions: iManifestRelease[];
  [key: string]: any;
}

export const getReleaseInfo = async (
  version: string,
  platform: NWPlatform,
  arch: NWArch,
  cacheDir: string,
  manifestUrl: string
): Promise<iManifestRelease> => {
  let releaseData: iManifestRelease;
  let manifestPath: string;
  if (platform === 'osx' && arch === 'arm64') {
    manifestPath = resolve(cacheDir, 'manifest.mac.arm.json');
  } else {
    manifestPath = resolve(cacheDir, 'manifest.json');
  }
  try {
    await promises.access(manifestPath);
    log.debug(`Manifest file already exists locally under ${cacheDir}`);
  } catch (e) {
    log.debug('Manifest file does not exist locally');
    log.debug(`Downloading latest manifest file under ${cacheDir}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await getManifest(manifestUrl);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await promises.writeFile(manifestPath, data.slice(9));
  } finally {
    log.debug('Store manifest metadata in memory');
    const manifest: iManifest = JSON.parse(
      await promises.readFile(resolve(manifestPath.toString()), 'utf-8')
    );
    log.debug(`Search for ${version} specific release data`);
    if (version === 'latest' || version === 'stable' || version === 'lts') {
      // Remove leading "v" from version string
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      release => release.version === `v${version}`
    ) as iManifestRelease;
  }
  return releaseData;
};
