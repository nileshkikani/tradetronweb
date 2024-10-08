import PropTypes from 'prop-types';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import Label from 'src/components/Label';
import Link from 'src/components/Link';

import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import OutboxTwoToneIcon from '@mui/icons-material/OutboxTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import DraftsTwoToneIcon from '@mui/icons-material/DraftsTwoTone';
import AutoDeleteTwoToneIcon from '@mui/icons-material/AutoDeleteTwoTone';
import LocalOfferTwoToneIcon from '@mui/icons-material/LocalOfferTwoTone';

const categoryTagIcons = {
  inbox: InboxTwoToneIcon,
  outbox: OutboxTwoToneIcon,
  favourites: FavoriteTwoToneIcon,
  drafts: DraftsTwoToneIcon,
  deleted: AutoDeleteTwoToneIcon
};

const getTagIcon = (tag) => {
  if (tag.type === 'category_tag') {
    return categoryTagIcons[tag.id];
  }

  return LocalOfferTwoToneIcon;
};

const getColor = (tag) => {
  if (tag.type === 'label_tag') {
    return tag.color;
  }

  return 'inherit';
};

export const MailboxSidebarItem = (props) => {
  const { active, tag, ...rest } = props;

  const TagIcon = getTagIcon(tag);
  const color = getColor(tag);
  const showUnread = Boolean(tag.unreadMails && tag.unreadMails > 0);
  const href =
    tag.id !== 'inbox'
      ? `/applications/mailbox?tag=${tag.id}`
      : '/applications/mailbox';

  return (
    <ListItemButton
      sx={{
        my: '2px'
      }}
      component={Link}
      href={href}
      selected={active}
      {...rest}
    >
      <ListItemIcon>
        <TagIcon
          color="inherit"
          sx={{
            color: color
          }}
        />
      </ListItemIcon>

      <ListItemText
        primary={tag.name}
        primaryTypographyProps={{
          fontWeight: tag.type === 'category_tag' ? 'bold' : null
        }}
      />
      {showUnread && <Label color="primary">{tag.unreadMails}</Label>}
    </ListItemButton>
  );
};

MailboxSidebarItem.propTypes = {
  active: PropTypes.bool,

  tag: PropTypes.object.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func
};
