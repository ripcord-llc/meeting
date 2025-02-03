import { mutate } from 'swr';

export type Config = {
  CLIENT_URL: string;
  API_URL: string;
};

export const CONFIG: Config = {
  CLIENT_URL: process.env.CLIENT_URL || '',
  API_URL: process.env.API_URL || '',
};

export function setConfig(newConfig: Config) {
  Object.assign(CONFIG, newConfig);

  mutate(() => true, undefined, { revalidate: false }); // Revalidate all SWR hooks if config changes
}

export { default as ConfigurationProvider } from './config-provider';
