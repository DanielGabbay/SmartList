import {setRemoteDefinitions} from '@nx/angular/mf';

declare const process: {
  env: {
    NODE_ENV: 'production' | 'development',
  };
}

const prod = process.env.NODE_ENV === 'production';
const mfManifest = `/module-federation.manifest${prod ? '.prod' : ''}.json`;

fetch(mfManifest)
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
