import type { IconName } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, Box, Button, createStyles, Group, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type NavBarItemType = {
  caption: string;
  icon: IconName;
  path?: string;
  onClick?: () => void;
};

const useStyles = createStyles((theme) => ({
  item: {
    height: 48,
  },
  itemContent: {
    width: 200,
    textAlign: 'left',
  },
  itemIcon: {
    color: theme.colors.blue[2],
  },
}));

export function NavBarItem(item: NavBarItemType) {
  const { classes } = useStyles();
  const router = useRouter();
  const isSelected = () => {
    if (item.path === '/') {
      return router.pathname === '/';
    }
    if (!item.path) {
      return false;
    }
    return router.pathname.startsWith(item.path);
  };

  return (
    <>
      {item.path && (
        <Link href={item.path} passHref>
          <Button
            className={classes.item}
            variant={isSelected() ? 'light' : 'subtle'}
            component={item.path ? 'a' : 'button'}
          >
            <Box className={classes.itemContent}>
              <Group>
                <Avatar>
                  <FontAwesomeIcon
                    className={classes.itemIcon}
                    icon={['fas', item.icon]}
                  />
                </Avatar>
                <Text size="sm">{item.caption}</Text>
              </Group>
            </Box>
          </Button>
        </Link>
      )}
      {item.onClick && (
        <Button
          className={classes.item}
          variant="subtle"
          component={item.path ? 'a' : 'button'}
          onClick={item.onClick}
        >
          <Box className={classes.itemContent}>
            <Group>
              <Avatar>
                <FontAwesomeIcon
                  className={classes.itemIcon}
                  icon={['fas', item.icon]}
                />
              </Avatar>
              <Text size="sm">{item.caption}</Text>
            </Group>
          </Box>
        </Button>
      )}
    </>
  );
}
