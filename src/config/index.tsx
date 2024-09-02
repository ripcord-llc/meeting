import { mutate } from 'swr';

export type Config = {
  CLIENT_URL: string;
  API_URL: string;
} & ({ SOURCE_TYPE: 'widget' } | { SOURCE_TYPE: 'landingPage'; landingPageId: number });

export const CONFIG: Config = {
  CLIENT_URL: process.env.CLIENT_URL || '',
  API_URL: process.env.API_URL || '',
  SOURCE_TYPE: 'widget',
};

export function setConfig(newConfig: Config) {
  Object.assign(CONFIG, newConfig);

  mutate(() => true, undefined, { revalidate: false }); // Revalidate all SWR hooks if config changes
}

export { default as ConfigurationProvider } from './config-provider';
