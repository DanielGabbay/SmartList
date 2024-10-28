import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'SmartListMain',
  exposes: {
    './Routes': 'apps/smart-list-main/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
