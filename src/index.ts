import { NWAB } from './main/main';

export * from './main/main';

const Builder = new NWAB({
  nwjs: { version: '0.13.2', platforms: ['osx', 'win', 'linux'] },
  app: {
    name: 'test',
    directory: './src',
  },
});

Builder.run('build')
  .then(() => {
    console.log('DONE');
  })
  .catch(e => console.log('ERROR', e));

export default NWAB;
