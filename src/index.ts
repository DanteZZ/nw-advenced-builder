import { NWAB } from './main';

export * from './main';

const Builder = new NWAB({
  nwjs: {
    version: '0.75.1',
    platforms: ['win'],
    platformSettings: {
      win: {
        arch: ['x64'],
      },
    },
  },
  app: {
    name: 'test',
    directory: './proj',
  },
});

Builder.run()
  .then(() => console.log('DONE'))
  .catch(e => console.log('ERROR', e));

export default NWAB;
