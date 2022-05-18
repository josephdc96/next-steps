import type { IconName } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Box, Button, createStyles, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type NavBarItemType = {
  caption: string;
  icon: IconName;
  path: string;
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

  return (
    <>
      <Link href={item.path} passHref>
        <Button className={classes.item} variant="subtle">
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
    </>
  );
}
