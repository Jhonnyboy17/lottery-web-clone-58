
/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency (BRL)
 * @param value - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return 'R$ 0,00';
  }
  
  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Format a date string to a localized date format
 * @param dateString - ISO date string
 * @param locale - Locale to use for formatting (default: pt-BR)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale: string = 'pt-BR'): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
