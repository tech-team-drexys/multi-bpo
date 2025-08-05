// Design System - Padrões visuais unificados para o projeto

export const spacing = {
  section: {
    sm: "py-16",
    md: "py-20",
    lg: "py-24",
    xl: "py-28",
  },
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  content: {
    xs: "mb-8",
    sm: "mb-12",
    md: "mb-16",
    lg: "mb-20",
  },
} as const;

export const typography = {
  heading: {
    xl: "text-4xl lg:text-5xl font-bold",
    lg: "text-3xl lg:text-4xl font-bold",
    md: "text-2xl lg:text-3xl font-bold",
    sm: "text-xl lg:text-2xl font-semibold",
  },
  body: {
    lg: "text-lg lg:text-xl",
    md: "text-base lg:text-lg",
    sm: "text-sm lg:text-base",
  },
} as const;

export const colors = {
  primary: {
    main: "blue-600",
    light: "blue-500",
    dark: "blue-700",
    accent: "blue-50",
  },
  secondary: {
    main: "emerald-600",
    light: "emerald-500",
    dark: "emerald-700",
    accent: "emerald-50",
  },
  neutral: {
    white: "white",
    gray50: "gray-50",
    gray100: "gray-100",
    gray600: "gray-600",
    gray900: "gray-900",
  },
} as const;

export const backgrounds = {
  primary: "bg-white",
  secondary: "bg-gray-50",
  accent: `bg-gradient-to-br from-${colors.primary.accent} to-white`,
} as const;

export const borderRadius = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
} as const;

export const shadows = {
  sm: "shadow-sm",
  md: "shadow-lg",
  lg: "shadow-xl",
  card: "shadow-lg border border-gray-100",
  cardHover: "hover:shadow-xl transition-all duration-300",
} as const;

export const components = {
  card: {
    base: `bg-white ${borderRadius.lg} ${shadows.card}`,
    hover: shadows.cardHover,
    padding: "p-6",
  },
  button: {
    default:
      "inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 group cursor-pointer",
    defaultArrow:
      "ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1",
    primary: `bg-${colors.primary.main} hover:bg-${colors.primary.dark} text-white`,
    secondary: `bg-${colors.secondary.main} hover:bg-${colors.secondary.dark} text-white`,
    outline: `border border-${colors.primary.main} text-${colors.primary.main} hover:bg-${colors.primary.main} hover:text-white`,
  },
} as const;
