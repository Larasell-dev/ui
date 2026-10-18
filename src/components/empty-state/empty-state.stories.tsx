import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import {
  CheckboxCircleLine,
  GroupLine,
  LockLine,
  ShoppingBag3Line,
  SearchLine,
} from '../../icons.ts';
import { Button } from '../form/button/button.tsx';
import { EmptyState } from './empty-state.tsx';

const meta = preview.meta({
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
});

/** Nothing exists yet and the data arrives on its own, so there is no action. */
export const FirstUse = meta.story({
  args: {
    icon: GroupLine,
    title: 'No customers yet',
    description: 'Customers appear here after they place their first order.',
  },
});

/** Onboarding: explain the page and give one clear way to get started. */
export const Onboarding = meta.story({
  args: {
    icon: ShoppingBag3Line,
    title: 'Add your first product',
    description:
      'Products are what customers buy in your shop. Add one to start selling.',
    children: <Button onClick={fn()}>Add product</Button>,
  },
});

/** A search or filter matched nothing: suggest how to broaden it. */
export const NoResults = meta.story({
  args: {
    icon: SearchLine,
    title: 'No orders match your filters',
    description: 'Try a different search term or clear the filters.',
    children: (
      <Button variant="secondary" onClick={fn()}>
        Clear filters
      </Button>
    ),
  },
});

/** The user handled everything: confirm it as a good outcome. */
export const AllDone = meta.story({
  args: {
    icon: CheckboxCircleLine,
    title: 'All caught up',
    description: "You've handled every contact request.",
  },
});

/** Content exists but can't be shown: say why and who can help. */
export const NoAccess = meta.story({
  args: {
    icon: LockLine,
    title: "You don't have access to invoices",
    description: 'Ask an owner of this shop to grant you access.',
  },
});

/** Primary and secondary actions side by side. */
export const MultipleActions = meta.story({
  args: {
    icon: ShoppingBag3Line,
    title: 'Add your first product',
    description: 'Create a product from scratch or import an existing catalog.',
    children: (
      <>
        <Button onClick={fn()}>Add product</Button>
        <Button variant="secondary" onClick={fn()}>
          Import CSV
        </Button>
      </>
    ),
  },
});

/** Title only, for tight spaces. */
export const TitleOnly = meta.story({
  args: {
    title: 'No notes',
  },
});

/**
 * Storybook's padded layout instead of centred. The empty state sits in the
 * top-left corner because it doesn't position itself; its parent does.
 */
export const Padded = meta.story({
  args: FirstUse.input.args,
  parameters: {
    layout: 'padded',
  },
});
