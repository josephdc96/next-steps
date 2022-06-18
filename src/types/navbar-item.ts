import type { IconName } from '@fortawesome/free-solid-svg-icons';
import type { Asset } from '#/lib/auth/contract';

export interface NavBarRoute {
  caption: string;
  icon: IconName;
  path: string;
  asset: Asset;
}
