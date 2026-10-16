// The Remix icons the design system exposes. Add an icon by importing it
// from `@iconify-icons/ri` (names match https://remixicon.com) and listing it
// below. `vp pack` copies only these icons into `dist`.
import addLine from '@iconify-icons/ri/add-line';
import arrowDownSLine from '@iconify-icons/ri/arrow-down-s-line';
import checkLine from '@iconify-icons/ri/check-line';
import closeLine from '@iconify-icons/ri/close-line';
import deleteBinLine from '@iconify-icons/ri/delete-bin-line';
import editLine from '@iconify-icons/ri/edit-line';
import errorWarningLine from '@iconify-icons/ri/error-warning-line';
import homeLine from '@iconify-icons/ri/home-line';
import informationLine from '@iconify-icons/ri/information-line';
import mailLine from '@iconify-icons/ri/mail-line';
import searchLine from '@iconify-icons/ri/search-line';
import settings3Line from '@iconify-icons/ri/settings-3-line';

export const icons = {
  'add-line': addLine,
  'arrow-down-s-line': arrowDownSLine,
  'check-line': checkLine,
  'close-line': closeLine,
  'delete-bin-line': deleteBinLine,
  'edit-line': editLine,
  'error-warning-line': errorWarningLine,
  'home-line': homeLine,
  'information-line': informationLine,
  'mail-line': mailLine,
  'search-line': searchLine,
  'settings-3-line': settings3Line,
};

export type IconName = keyof typeof icons;
