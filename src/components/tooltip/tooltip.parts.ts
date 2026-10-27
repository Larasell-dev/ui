import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

export { TooltipPopup as Popup } from './tooltip-popup.tsx';

/** Shares the open delay across tooltips, so moving between them is instant. */
export const Provider = BaseTooltip.Provider;

/** A tooltip: a `<Tooltip.Trigger>` and the `<Tooltip.Popup>` it shows. */
export const Root = BaseTooltip.Root;

/**
 * Shows the tooltip on hover and focus. Base UI's trigger, forwarded as is:
 * unstyled, so style it yourself with `className`, or swap it with
 * `render={<IconButton aria-label="Delete">…</IconButton>}`.
 */
export const Trigger = BaseTooltip.Trigger;
