import { setConfig, Config } from './config';

import RipcordInline from './RipcordInline';
import Ripcord from './Ripcord';

export function INTERNAL_USE_ONLY_setConfig(config: Config) {
  setConfig(config);

  RipcordInline.INTERNAL_USE_ONLY_onConfigChange();
  Ripcord.INTERNAL_USE_ONLY_onConfigChange();
}
