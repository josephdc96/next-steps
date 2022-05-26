import { createStyles } from '@mantine/core';

export default createStyles((theme) => {
  return {
    appCard: {
      width: 160,
      height: 150,
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[0],
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[3]
            : theme.colors.gray[2],
      },
      padding: theme.spacing.sm,
    },
  };
});
