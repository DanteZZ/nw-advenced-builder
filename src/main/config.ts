import { NWABConfig } from './types';

export const defaultConfig: NWABConfig = {
  nwjs: {
    version: 'latest',
    platforms: ['win', 'linux', 'osx'],
    arch: ['ia32', 'x64'],
    packages: {
      win: ['nsis'],
      osx: ['dmg'],
      linux: ['appimage'],
    },
  },
  app: {
    name: 'nw-app',
    directory: '',
    output: './releases',
    cache: './cache',
  },
};
