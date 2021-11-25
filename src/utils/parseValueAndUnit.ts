import { OffsetShape, RotationUnits, Units } from '../types';

/**
 * Determines the unit of a string and parses the value
 */

export function parseValueAndUnit(str?: string | number): OffsetShape {
  let out: OffsetShape = { value: 0, unit: 'px' };

  if (typeof str === 'undefined') return out;

  const isValid = typeof str === 'number' || typeof str === 'string';

  if (!isValid) {
    throw new Error(
      'Invalid value provided. Must provide a value as a string or number'
    );
  }

  str = String(str);
  out.value = parseFloat(str);

  // NOTE: Must allow custom defaults for various transforms
  // @ts-ignore
  out.unit = str.match(/[\d.\-\+]*\s*(.*)/)[1] || '%'; // default to percent

  const validUnits = [
    Units.px,
    Units['%'],
    RotationUnits.deg,
    RotationUnits.turn,
    RotationUnits.rad,
  ];
  const isValidUnit = validUnits.find(unit => unit === out.unit);

  if (!isValidUnit) {
    throw new Error('Invalid unit provided.');
  }

  return out;
}
