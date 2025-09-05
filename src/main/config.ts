import { NWABConfig } from './types.js';

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
    manifestRepoUrl: 'https://nwjs.io/versions.json',
    ffmpegRepoUrl: 'https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download'
  },
  app: {
    name: 'nw-app',
    directory: '',
    output: './dist',
    cache: './cache',
  },
};
