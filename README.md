## Installation

```bash
pnpm i -D nw-advenced-builder
```

## Usage in dev

```ts
import NWAB from 'nw-advenced-builder';

const Builder = new NWAB({
  nwjs: {
    version: '0.72.0',
    platforms: ['win', 'linux', 'osx'],
    arch: ['x64', 'arm64'],
    ffmpeg: true,
    platformSettings: {
      win: {
        arch: ['x64'],
      },
      linux: {
        arch: ['x64'],
      },
      osx: {
        version: '0.62.2',
        arch: ['x64', 'arm64'],
      },
    },
  },
  app: {
    version: '1.3.7',
    name: 'test',
    directory: './example',
    output: './dist',
    icon: './example/icon.ico',
  },
});

Builder.run()
  .then(() => console.log('DONE'))
  .catch(e => console.log('ERROR', e));
```

## Usage in build

```ts
import NWAB from 'nw-advenced-builder';

const Builder = new NWAB({
  nwjs: {
    version: '0.72.0',
    platforms: ['win', 'linux', 'osx'],
    arch: ['x64', 'arm64'],
    ffmpeg: true,
    platformSettings: {
      win: {
        arch: ['x64'],
      },
      linux: {
        arch: ['x64'],
      },
      osx: {
        version: '0.62.2',
        arch: ['x64', 'arm64'],
      },
    },
  },
  app: {
    version: '1.3.7',
    name: 'test',
    directory: './example',
    output: './dist',
    icon: './example/icon.ico',
  },
});

Builder.run('build')
  .then(() => console.log('DONE'))
  .catch(e => console.log('ERROR', e));
```
