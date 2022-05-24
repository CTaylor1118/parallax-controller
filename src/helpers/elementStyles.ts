import { Element } from '../classes/Element';
import { ParallaxStartEndEffects, ValidCSSEffects } from '../types';
import { scaleEffectByProgress } from './scaleEffectByProgress';

// Exclude opacity from transforms
const TRANSFORM_EFFECTS = Object.values(ValidCSSEffects).filter(
  v => v !== 'opacity'
);

export function setWillChangeStyles(
  el: HTMLElement | SVGElement,
  effects: ParallaxStartEndEffects
) {
  const keys = Object.keys(effects);
  const hasOpacity = keys.includes('opacity');
  const willChange = `transform${hasOpacity ? ',opacity' : ''}`;
  el.style.setProperty('will-change', willChange);
}

export function setElementStyles(
  effects: ParallaxStartEndEffects,
  progress: number,
  el?: HTMLElement | SVGElement
) {
  if (!el) return;
  const transform = getTransformStyles(effects, progress);
  const opacity = getOpacityStyles(effects, progress);
  el.style.setProperty('transform', transform);
  el.style.setProperty('opacity', opacity);
}

export function getOpacityStyles(
  effects: ParallaxStartEndEffects,
  progress: number
): string {
  const scaledOpacity =
    effects['opacity'] && scaleEffectByProgress(effects['opacity'], progress);

  if (
    typeof scaledOpacity === 'undefined' ||
    typeof scaledOpacity.value === 'undefined' ||
    typeof scaledOpacity.unit === 'undefined'
  ) {
    return '';
  }

  const styleStr = `${scaledOpacity.value}`;

  return styleStr;
}

export function getTransformStyles(
  effects: ParallaxStartEndEffects,
  progress: number
): string {
  const transform: string = TRANSFORM_EFFECTS.map((key: string) => {
    const scaledEffect =
      // @ts-expect-error
      effects[key] && scaleEffectByProgress(effects[key], progress);

    if (
      typeof scaledEffect === 'undefined' ||
      typeof scaledEffect.value === 'undefined' ||
      typeof scaledEffect.unit === 'undefined'
    ) {
      return '';
    }

    return `${key}(${scaledEffect.value}${scaledEffect.unit})`;
  }).join(' ');

  return transform;
}

/**
 * Takes a parallax element and removes parallax offset styles.
 * @param {object} element
 */
export function resetStyles(element: Element) {
  const el = element.el;
  if (!el) return;
  el.style.removeProperty('transform');
  el.style.removeProperty('opacity');
}
