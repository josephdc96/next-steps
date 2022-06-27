import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { MantineColor } from '@mantine/core';
import { Button, Tooltip } from '@mantine/core';
import type { IconName } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '@mantine/hooks';

interface HeaderButtonProps {
  icon: IconName;
  caption: string;
  color?: MantineColor;
  disabled?: boolean;
  onClick?: () => void;
}

export const HeaderButton = ({
  icon,
  color,
  caption,
  disabled,
  onClick,
}: HeaderButtonProps) => {
  const isMobile = useMediaQuery('(max-width: 1200px)');

  return (
    <Button
      disabled={disabled}
      color={color}
      radius="xl"
      leftIcon={isMobile ? undefined : <FontAwesomeIcon icon={icon} />}
      onClick={onClick}
    >
      <>
        {!isMobile && <>{caption}</>}
        {isMobile && <FontAwesomeIcon icon={icon} />}
      </>
    </Button>
  );
};
