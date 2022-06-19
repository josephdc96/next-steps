import type { NavBarRoute } from '#/types/navbar-item';

import { UserRole } from '#/types/personnel';

export const routes: NavBarRoute[] = [
  {
    caption: 'Home',
    icon: 'home',
    path: '/',
    asset: {
      role: [
        UserRole.Admin,
        UserRole.TeamLeader,
        UserRole.SuperUser,
        UserRole.Leader,
      ],
    },
  },
  {
    caption: 'Personnel',
    icon: 'person',
    path: '/personnel',
    asset: {
      role: [UserRole.Admin, UserRole.TeamLeader, UserRole.SuperUser],
    },
  },
  {
    caption: 'Subteams',
    icon: 'people-group',
    path: '/subteams',
    asset: {
      role: [
        UserRole.Admin,
        UserRole.TeamLeader,
        UserRole.SuperUser,
        UserRole.Leader,
      ],
    },
  },
  {
    caption: 'Assignments',
    icon: 'clipboard-user',
    path: '/assignments',
    asset: {
      role: [
        UserRole.Admin,
        UserRole.TeamLeader,
        UserRole.SuperUser,
        UserRole.Leader,
      ],
    },
  },

  {
    caption: 'Cards',
    icon: 'contact-card',
    path: '/cards',
    asset: {
      role: [
        UserRole.Admin,
        UserRole.TeamLeader,
        UserRole.SuperUser,
        UserRole.Leader,
      ],
    },
  },
  {
    caption: 'Documents',
    icon: 'file-text',
    path: '/documents',
    asset: {
      role: [UserRole.Admin, UserRole.TeamLeader, UserRole.SuperUser],
    },
  },
];
