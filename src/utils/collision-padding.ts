/**
 * The space a popup keeps from the viewport's edges when it flips, shifts and
 * sizes itself. At the top it also keeps clear of the app's sticky chrome, such
 * as a mobile nav bar, which the app sets as `--popup-collision-top`. Read when
 * the popup opens, so it follows the breakpoint.
 */
export function collisionPadding() {
  const top = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--popup-collision-top',
    ),
  );
  return {
    top: 5 + (Number.isFinite(top) ? top : 0),
    right: 5,
    bottom: 5,
    left: 5,
  };
}
