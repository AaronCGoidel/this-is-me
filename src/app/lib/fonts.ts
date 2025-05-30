// Font utility classes for PPMori
export const fontWeights = {
  extraLight: "font-extralight", // 200
  normal: "font-normal", // 400
  semiBold: "font-semibold", // 600
} as const;

export const fontStyles = {
  normal: "not-italic",
  italic: "italic",
} as const;

// PPMori font combinations
export const ppMori = {
  extraLight: "font-extralight not-italic",
  extraLightItalic: "font-extralight italic",
  regular: "font-normal not-italic",
  regularItalic: "font-normal italic",
  semiBold: "font-semibold not-italic",
  semiBoldItalic: "font-semibold italic",
} as const;

// Combined font utilities for easy access
export const fonts = {
  mori: ppMori,
} as const;
