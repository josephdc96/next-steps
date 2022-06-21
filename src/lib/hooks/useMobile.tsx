import { useContext } from 'react';
import { MobileNav } from '#/providers/MobileProvider';

export default function useMobile() {
  return useContext(MobileNav);
}
