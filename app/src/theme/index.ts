/**
 * Theme index file
 * Exports all theme values and provides utility functions
 */

import { Colors } from "./colors";
import { Spacing } from "./spacing";
import { Typography } from "./typography";

export * from "./colors";
export * from "./spacing";
export * from "./typography";

/**
 * Helper function to get color value
 * @param color Key of the color to retrieve
 * @returns Color string
 */
export const getColor = (color: keyof typeof Colors): string => Colors[color];

/**
 * Helper function to get typography value
 * @param typo Key of the typography to retrieve
 * @returns Typography value (number for sizes, string for weights, etc.)
 */
export const getTypography = (typo: keyof typeof Typography): any =>
  Typography[typo];

/**
 * Helper function to get spacing value
 * @param space Key of the spacing to retrieve
 * @returns Spacing value (number)
 */
export const getSpacing = (space: keyof typeof Spacing): number =>
  Spacing[space];
