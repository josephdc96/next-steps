import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  Navbar: {},
  user: {
    paddingLeft: 18,
    paddingRight: 18,
    height: 60,
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[3],
    },
  },
  userInfo: {
    width: 150,
    textAlign: 'left',
  },
  colorSchemeToggle: {
    marginLeft: '1.25rem',
    marginTop: '.5rem',
  },
  teamSelector: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[4],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[3],
    },
  },
}));
