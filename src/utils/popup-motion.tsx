import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import {
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type HTMLAttributes,
  type Ref,
} from 'react';

type Side =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'inline-start'
  | 'inline-end'
  | 'none';

const DISTANCE = 4;

// The popup starts and ends slightly toward its anchor, so it slides away from
// the trigger on enter and back toward it on exit. When the positioner flips a
// bottom popup to the top, it slides in from (and out to) the bottom.
function offset(side: Side) {
  switch (side) {
    case 'bottom':
      return { x: 0, y: -DISTANCE };
    case 'top':
      return { x: 0, y: DISTANCE };
    case 'right':
    case 'inline-end':
      return { x: -DISTANCE, y: 0 };
    case 'left':
    case 'inline-start':
      return { x: DISTANCE, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

const spring: Transition = { type: 'spring', bounce: 0, duration: 0.2 };
const instant: Transition = { duration: 0 };

type PopupMotionProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
  side: Side;
};

/**
 * Animates a Base UI popup in and out. Use it as the popup's `render` inside
 * an `<AnimatePresence>` that mounts the popup while open.
 */
export function PopupMotion({ side, ...props }: PopupMotionProps) {
  const reduceMotion = useReducedMotion();
  const currentSide = reduceMotion ? 'none' : side;
  const transition = reduceMotion ? instant : spring;
  const hidden = offset(currentSide);
  const x = useMotionValue(hidden.x);
  const y = useMotionValue(hidden.y);

  // The side is only known after the first layout and can flip while the popup
  // is entering, so mirror the slide in progress onto the new side.
  const previousSide = useRef(currentSide);
  useLayoutEffect(() => {
    const from = offset(previousSide.current);
    previousSide.current = currentSide;
    if (from.x === hidden.x && from.y === hidden.y) return;
    if (from.x) x.set((x.get() / from.x) * hidden.x);
    if (from.y) y.set((y.get() / from.y) * hidden.y);
    animate(x, 0, transition);
    animate(y, 0, transition);
  }, [currentSide, hidden.x, hidden.y, x, y, transition]);

  return (
    <motion.div
      {...(props as ComponentProps<typeof motion.div>)}
      style={{ ...props.style, x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...hidden }}
      transition={transition}
    />
  );
}
