import { defineRule } from 'vite-plus/lint/plugins';
import { classLists } from '../../class-names.ts';
import { planeBackgrounds, planes } from '../../elevation.ts';

const isBackgroundColor = (utility: string) =>
  /^bg-(white|black|transparent|current|inherit|[a-z]+|[a-z]+-\d+|\[.+\]|\(.+\))(\/.+)?$/.test(
    utility,
  ) &&
  !/^bg-(clip|origin|repeat|no-repeat|fixed|local|scroll|none|auto|cover|contain|center|top|bottom|left|right)\b/.test(
    utility,
  );

const isBorderWidth = (utility: string) =>
  /^border(-[xytrblse])?(-(\d+|\[.+\]|\(.+\)))?$/.test(utility);

export const planeTokens = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Each elevation shadow sits on its plane, with a border, and scrims use the overlay tokens.',
    },
    messages: {
      wrongPlane: '{{shadow}} belongs on its plane: use {{background}}.',
      missingBorder:
        '{{shadow}} needs a border: a shadow alone is no visible boundary (WCAG 1.4.11).',
      missingClip:
        '{{shadow}} needs bg-clip-padding, so the semi-transparent border blends with what is behind the plane.',
      overlayShadow:
        'The overlay is a scrim and casts no shadow. Put the shadow on the elevated plane above it.',
      rawScrim:
        '`{{className}}` is not the scrim blur. Scrims use bg-overlay backdrop-blur-overlay.',
      darkOverride:
        '{{background}} already switches in dark mode. Remove `{{className}}`.',
    },
  },
  create(context) {
    return classLists(context, (classNames) => {
      // A class applies to a variant when it has no variant or the same one.
      const has = (variant: string, test: (utility: string) => boolean) =>
        classNames.some(
          (other) =>
            (other.variant === '' || other.variant === variant) &&
            test(other.utility),
        );

      for (const { raw, variant, utility, node } of classNames) {
        const background = planes[utility];
        if (background !== undefined) {
          const data = { shadow: utility, background };
          if (has(variant, (other) => other === 'bg-overlay')) {
            context.report({ node, messageId: 'overlayShadow' });
            continue;
          }
          if (!has(variant, (other) => other === background)) {
            context.report({ node, messageId: 'wrongPlane', data });
          }
          if (!has(variant, isBorderWidth)) {
            context.report({ node, messageId: 'missingBorder', data });
          }
          if (!has(variant, (other) => other === 'bg-clip-padding')) {
            context.report({ node, messageId: 'missingClip', data });
          }
        }

        if (
          utility.startsWith('backdrop-blur') &&
          utility !== 'backdrop-blur-overlay' &&
          utility !== 'backdrop-blur-none'
        ) {
          context.report({
            node,
            messageId: 'rawScrim',
            data: { className: raw },
          });
        }

        if (variant.split(':').includes('dark') && isBackgroundColor(utility)) {
          const plane = classNames.find(
            (other) =>
              other.variant === '' && planeBackgrounds.has(other.utility),
          );
          if (plane) {
            context.report({
              node,
              messageId: 'darkOverride',
              data: { background: plane.utility, className: raw },
            });
          }
        }
      }
    });
  },
});
