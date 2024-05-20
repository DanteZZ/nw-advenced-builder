import objectAssignDepp from 'object-assign-deep';

import { NWABConfig } from './types';
import { defaultConfig } from './config';

export class NWAB {
  public config: NWABConfig = defaultConfig;
  constructor(config: NWABConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.config = objectAssignDepp(this.config, config);
  }
}
