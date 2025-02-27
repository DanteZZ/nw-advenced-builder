import objectAssignDeep from 'object-assign-deep';
import process from 'process';

import { NWABConfig, NWArch, NWFlavor, NWPlatform } from './types';
import { defaultConfig } from './config';
import { getArch } from '../utils/arch';
import { getPlatform } from '../utils/platform';
import { resolve } from 'path';
import { isCached } from '../utils/cache';
import { download } from '../utils/download';
import { promises } from 'fs';
import { getReleaseInfo } from '../utils/getReleaseInfo';
import { decompress } from '../utils/decompress';
import { remove } from '../utils/remove';
import { log } from './log';
import { xattr } from '../utils/xattr';
import { execute } from '../utils/exec';
import { build } from '../utils/build';

export class NWAB {
  public config: NWABConfig = defaultConfig;
  private cacheDir: string;

  constructor(config: NWABConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.config = objectAssignDeep(this.config, config);
    this.cacheDir = this.config.app.cache || './cache';
  }

  public async run(mode: RunMode = 'dev'): Promise<void> {
    log.info(`Run in ${mode.toUpperCase()} mode...`);
    log.info('Selected versions:');
    log.info(this.getNWBuilds());

    await this.verifyCache(mode);
    if (mode === 'dev') {
      await this.dev();
    } else {
      await this.build();
    }
  }

  public async dev(): Promise<void> {
    try {
      if (this.getBinaryName() === null) {
        throw new Error('Unsupported platform.');
      }

      const build = {
        version: this.getVersion(),
        flavor: 'sdk',
        platform: this.getPlatform(),
        arch: this.getArch(),
      };

      const nwBinary = resolve(
        this.cacheDir,
        `nwjs${build.flavor === 'sdk' ? '-sdk' : ''}-v${build.version}-${
          build.platform
        }-${build.arch}`,
        this.getBinaryName()
      );
      const proc = await execute(
        resolve(this.config.app.directory),
        nwBinary,
        ''
      );

      proc.on('close', () => process.kill(process.pid));
      proc.on('exit', () => process.kill(process.pid));

      process.on('SIGINT', () => {
        proc.kill();
        process.kill(process.pid);
      }); // catch ctrl-c
      process.on('SIGTERM', () => {
        proc.kill();
        process.kill(process.pid);
      }); // catch kill
    } catch (error) {
      log.error(error);
    }
  }

  public async build(): Promise<void> {
    try {
      if (this.getBinaryName() === null) {
        throw new Error('Unsupported platform.');
      }
      const builds = this.getNWBuilds();

      for (const b of builds) {
        log.info('Start building', b);
        const nwDir = resolve(
          this.cacheDir,
          `nwjs${b.flavor === 'sdk' ? '-sdk' : ''}-v${b.version}-${
            b.platform
          }-${b.arch}`
        );
        await build(
          this.config.app.directory,
          nwDir,
          `${this.config.app.output}/${b.platform}-${b.arch}` || '',
          b.platform,
          this.config
        );
      }
    } catch (error) {
      log.error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verifyCache(mode: RunMode): Promise<void> {
    log.info('Verifying cache...');
    // Check cache dir
    if ((await isCached(this?.config?.app?.cache || './cache')) === false) {
      await promises.mkdir(this?.config?.app?.cache || './cache', {
        recursive: true,
      });
    }

    const nwBuilds: NWBuild[] =
      mode === 'dev'
        ? [
            {
              version: this.getVersion(),
              flavor: 'sdk',
              platform: this.getPlatform(),
              arch: this.getArch(),
            },
          ]
        : this.getNWBuilds();
    if (mode === 'build')
      log.info(
        `Used NW binaries: ${nwBuilds
          .map(
            b => `${b.platform}-${b.arch}${b.flavor === 'sdk' ? '-sdk' : ''}`
          )
          .join(', ')}`
      );
    for (const build of nwBuilds) {
      const nwDir = resolve(
        this.cacheDir,
        `nwjs${build.flavor === 'sdk' ? '-sdk' : ''}-v${build.version}-${
          build.platform
        }-${build.arch}`
      );

      if (!(await isCached(nwDir))) {
        log.debug(
          `Download relevant NW.js binary of ${build.platform}-${build.arch}${
            build.flavor === 'sdk' ? '-sdk' : ''
          }`
        );
        let ver = build.version;
        const releaseInfo = await getReleaseInfo(
          build.version,
          build.platform,
          build.arch,
          this.cacheDir,
          this.config.nwjs?.manifestRepoUrl || ''
        );
        // Remove leading "v" from version string
        ver = releaseInfo.version.slice(1);

        if (!releaseInfo.files.includes(`${build.platform}-${build.arch}`)) {
          throw new Error(
            `Platform ${build.platform} and architecture ${build.arch} is not supported by this download server. Sorry!`
          );
        }

        await download(
          ver,
          build.flavor,
          build.platform,
          build.arch,
          this.config.nwjs?.buildsRepoUrl || '',
          this.cacheDir
        );
        await decompress(
          build.platform,
          this.cacheDir,
          this.config.nwjs?.buildsRepoUrl || ''
        );
        await remove(
          build.platform,
          this.cacheDir,
          this.config.nwjs?.buildsRepoUrl || ''
        );
        try {
          await xattr(build.platform, build.arch, nwDir);
        } catch (e) {
          log.warn(e);
        }
      } else {
        log.debug('Using cached NW.js binaries');
      }
    }
  }

  private getArch(arch?: NWArch): NWArch {
    return getArch(arch);
  }

  private getPlatform(platform?: NWPlatform): NWPlatform {
    return getPlatform(platform);
  }

  private getVersion(platform?: NWPlatform, arch?: NWArch) {
    const p = platform || this.getPlatform();
    const a = arch || this.getArch();
    return (
      this.config?.nwjs?.platformSettings?.[p]?.archSettings?.[a]?.version ||
      this.config?.nwjs?.platformSettings?.[p]?.version ||
      this.config?.nwjs?.version ||
      'latest'
    );
  }

  private getFlavor(platform?: NWPlatform, arch?: NWArch) {
    const p = platform || this.getPlatform();
    const a = arch || this.getArch();
    return (
      this.config?.nwjs?.platformSettings?.[p]?.archSettings?.[a]?.flavor ||
      this.config?.nwjs?.platformSettings?.[p]?.flavor ||
      this.config?.nwjs?.flavor ||
      'normal'
    );
  }

  private getNWBuilds(): NWBuild[] {
    const p = this.config?.nwjs?.platforms || [];
    const a = this.config?.nwjs?.arch || [];
    const result: NWBuild[] = [];
    p.forEach(plat =>
      a.forEach(arch =>
        result.push({
          version: this.getVersion(plat, arch),
          flavor: this.getFlavor(plat, arch),
          platform: this.getPlatform(plat),
          arch: this.getArch(arch),
        })
      )
    );
    return result.filter(b => {
      const arch: NWArch[] =
        this.config.nwjs?.platformSettings?.[b.platform]?.arch ||
        this.config.nwjs?.arch ||
        [];
      return arch.includes(b.arch);
    });
  }

  private getBinaryName = (platform?: NWPlatform): string => {
    const p = platform || this.getPlatform();
    switch (p) {
      case 'linux':
        return 'nw';
      case 'osx':
        return 'nwjs.app/Contents/MacOS/nwjs';
      default:
        return 'nw.exe';
    }
  };
}

type RunMode = 'dev' | 'build';
type NWBuild = {
  version: string;
  flavor: NWFlavor;
  platform: NWPlatform;
  arch: NWArch;
};
