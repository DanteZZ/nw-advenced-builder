import objectAssignDeep from 'object-assign-deep';

import { NWABConfig, NWArch, NWPlatform } from './types';
import { defaultConfig } from './config';
import { getArch } from '../utils/arch';
import { getPlatform } from '../utils/platform';

export class NWAB {
  public config: NWABConfig = defaultConfig;
  constructor(config: NWABConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.config = objectAssignDeep(this.config, config);
  }

  public async run(mode: RunMode = 'dev'): Promise<void> {
    await this.verifyCache(mode);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verifyCache(mode: RunMode): Promise<void> {
    const nwBuilds: NWBuild[] =
      mode === 'dev'
        ? [
            {
              version: this.getVersion(),
              flavour: 'sdk',
              platform: this.getPlatform(),
              arch: this.getArch(),
            },
          ]
        : this.getNWBuilds();
    console.log('builds', nwBuilds);
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

  private getFlavour(platform?: NWPlatform, arch?: NWArch) {
    const p = platform || this.getPlatform();
    const a = arch || this.getArch();
    return (
      this.config?.nwjs?.platformSettings?.[p]?.archSettings?.[a]?.flavour ||
      this.config?.nwjs?.platformSettings?.[p]?.flavour ||
      this.config?.nwjs?.flavour ||
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
          flavour: this.getFlavour(plat, arch),
          platform: this.getPlatform(plat),
          arch: this.getArch(arch),
        })
      )
    );
    return result;
  }
}

type RunMode = 'dev' | 'build';
type NWBuild = {
  version: string;
  flavour: string;
  platform: string;
  arch: string;
};
