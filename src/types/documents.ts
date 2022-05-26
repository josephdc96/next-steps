import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface Document {
  id: string;
  embedURL: string;
  name: string;
  icon: IconProp;
}
