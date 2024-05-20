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
    platformSettings: {
      osx: {
        arch: ['x64'],
      },
    },
    buildsRepoUrl: 'https://dl.nwjs.io',
    manifestRepoUrl: 'https://nwjs.io/versions',
  },
  app: {
    name: 'nw-app',
    directory: '',
    output: './releases',
    cache: './cache',
  },
};
