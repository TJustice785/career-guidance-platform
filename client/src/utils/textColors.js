// Utility for consistent text colors across light and dark modes

export const textColors = {
  // Primary text colors
  primary: 'text-gray-900 dark:text-gray-100',
  secondary: 'text-gray-700 dark:text-gray-300',
  tertiary: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500',
  
  // Headings
  heading: 'text-gray-900 dark:text-white',
  subheading: 'text-gray-800 dark:text-gray-200',
  
  // Labels and form text
  label: 'text-gray-700 dark:text-gray-300',
  placeholder: 'text-gray-500 dark:text-gray-400',
  
  // Status colors
  success: 'text-green-700 dark:text-green-400',
  error: 'text-red-700 dark:text-red-400',
  warning: 'text-yellow-700 dark:text-yellow-400',
  info: 'text-blue-700 dark:text-blue-400',
  
  // Interactive elements
  link: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
  button: 'text-white dark:text-gray-900',
  
  // Background colors
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    card: 'bg-white dark:bg-gray-800',
    input: 'bg-white dark:bg-gray-700',
  },
  
  // Border colors
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    focus: 'border-blue-500 dark:border-blue-400',
  }
};

export const getTextColor = (type = 'primary') => {
  return textColors[type] || textColors.primary;
};

export const getBgColor = (type = 'primary') => {
  return textColors.bg[type] || textColors.bg.primary;
};

export const getBorderColor = (type = 'primary') => {
  return textColors.border[type] || textColors.border.primary;
};
