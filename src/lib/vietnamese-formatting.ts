/**
 * Vietnamese locale formatting utilities
 * Provides consistent formatting for dates, times, numbers, and currency
 * according to Vietnamese conventions
 */

// Vietnamese locale constants
export const VIETNAMESE_LOCALE = 'vi-VN';
export const VIETNAMESE_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const VIETNAMESE_CURRENCY = 'VND';

/**
 * Format date in Vietnamese style
 * @param date - Date to format
 * @param style - Format style: 'short', 'medium', 'long', 'full'
 * @returns Formatted date string
 */
export function formatVietnameseDate(date: Date, style: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: VIETNAMESE_TIMEZONE,
  };

  switch (style) {
    case 'short':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      break;
    case 'medium':
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'long':
      options.weekday = 'long';
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'full':
      options.weekday = 'long';
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      options.era = 'long';
      break;
  }

  return new Intl.DateTimeFormat(VIETNAMESE_LOCALE, options).format(date);
}

/**
 * Format time in Vietnamese style
 * @param date - Date to format time from
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string
 */
export function formatVietnameseTime(date: Date, includeSeconds: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: VIETNAMESE_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Vietnamese uses 24-hour format
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  return new Intl.DateTimeFormat(VIETNAMESE_LOCALE, options).format(date);
}

/**
 * Format date and time together in Vietnamese style
 * @param date - Date to format
 * @param dateStyle - Date format style
 * @param includeSeconds - Whether to include seconds in time
 * @returns Formatted date and time string
 */
export function formatVietnameseDateTime(
  date: Date, 
  dateStyle: 'short' | 'medium' | 'long' = 'medium',
  includeSeconds: boolean = false
): string {
  const formattedDate = formatVietnameseDate(date, dateStyle);
  const formattedTime = formatVietnameseTime(date, includeSeconds);
  return `${formattedDate} lúc ${formattedTime}`;
}

/**
 * Format numbers in Vietnamese style
 * @param number - Number to format
 * @param minimumFractionDigits - Minimum decimal places
 * @param maximumFractionDigits - Maximum decimal places
 * @returns Formatted number string
 */
export function formatVietnameseNumber(
  number: number, 
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat(VIETNAMESE_LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);
}

/**
 * Format currency in Vietnamese Dong (VND)
 * @param amount - Amount to format
 * @param showSymbol - Whether to show currency symbol
 * @returns Formatted currency string
 */
export function formatVietnameseCurrency(amount: number, showSymbol: boolean = true): string {
  if (showSymbol) {
    return new Intl.NumberFormat(VIETNAMESE_LOCALE, {
      style: 'currency',
      currency: VIETNAMESE_CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    return new Intl.NumberFormat(VIETNAMESE_LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đồng';
  }
}

/**
 * Format percentage in Vietnamese style
 * @param value - Value to format as percentage (0.5 = 50%)
 * @param decimalPlaces - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatVietnamesePercentage(value: number, decimalPlaces: number = 1): string {
  return new Intl.NumberFormat(VIETNAMESE_LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

/**
 * Format relative time in Vietnamese (e.g., "2 giờ trước", "trong 3 ngày")
 * @param date - Date to compare with current time
 * @returns Formatted relative time string
 */
export function formatVietnameseRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  // Future or past
  const isFuture = diffInSeconds > 0;
  const prefix = isFuture ? 'trong' : '';
  const suffix = isFuture ? 'nữa' : 'trước';

  if (absDiff < 60) {
    return isFuture ? 'trong vài giây nữa' : 'vừa xong';
  } else if (absDiff < 3600) {
    const minutes = Math.floor(absDiff / 60);
    return `${prefix} ${minutes} phút ${suffix}`.trim();
  } else if (absDiff < 86400) {
    const hours = Math.floor(absDiff / 3600);
    return `${prefix} ${hours} giờ ${suffix}`.trim();
  } else if (absDiff < 604800) {
    const days = Math.floor(absDiff / 86400);
    return `${prefix} ${days} ngày ${suffix}`.trim();
  } else if (absDiff < 2592000) {
    const weeks = Math.floor(absDiff / 604800);
    return `${prefix} ${weeks} tuần ${suffix}`.trim();
  } else if (absDiff < 31536000) {
    const months = Math.floor(absDiff / 2592000);
    return `${prefix} ${months} tháng ${suffix}`.trim();
  } else {
    const years = Math.floor(absDiff / 31536000);
    return `${prefix} ${years} năm ${suffix}`.trim();
  }
}

/**
 * Format file size in Vietnamese
 * @param bytes - Size in bytes
 * @returns Formatted file size string
 */
export function formatVietnameseFileSize(bytes: number): string {
  const units = ['byte', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const formattedSize = formatVietnameseNumber(size, 0, unitIndex === 0 ? 0 : 1);
  return `${formattedSize} ${units[unitIndex]}`;
}

/**
 * Format duration in Vietnamese (e.g., "2 giờ 30 phút")
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatVietnameseDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} giờ`;
  }

  return `${hours} giờ ${remainingMinutes} phút`;
}

/**
 * Format quantity with Vietnamese units
 * @param quantity - Numeric quantity
 * @param unit - Unit name
 * @returns Formatted quantity string
 */
export function formatVietnameseQuantity(quantity: number, unit: string): string {
  const formattedQuantity = formatVietnameseNumber(quantity);
  return `${formattedQuantity} ${unit}`;
}

/**
 * Get Vietnamese day of week name
 * @param date - Date to get day name from
 * @param format - 'long' or 'short' format
 * @returns Vietnamese day name
 */
export function getVietnameseDayName(date: Date, format: 'long' | 'short' = 'long'): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: format,
    timeZone: VIETNAMESE_TIMEZONE,
  };
  return new Intl.DateTimeFormat(VIETNAMESE_LOCALE, options).format(date);
}

/**
 * Get Vietnamese month name
 * @param date - Date to get month name from
 * @param format - 'long', 'short', or 'numeric' format
 * @returns Vietnamese month name
 */
export function getVietnameseMonthName(date: Date, format: 'long' | 'short' | 'numeric' = 'long'): string {
  const options: Intl.DateTimeFormatOptions = {
    month: format,
    timeZone: VIETNAMESE_TIMEZONE,
  };
  return new Intl.DateTimeFormat(VIETNAMESE_LOCALE, options).format(date);
}

/**
 * Check if a date is today in Vietnamese timezone
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  const vietnameseToday = new Date(today.toLocaleString('en-US', { timeZone: VIETNAMESE_TIMEZONE }));
  const vietnameseDate = new Date(date.toLocaleString('en-US', { timeZone: VIETNAMESE_TIMEZONE }));
  
  return vietnameseToday.toDateString() === vietnameseDate.toDateString();
}

/**
 * Check if a date is tomorrow in Vietnamese timezone
 * @param date - Date to check
 * @returns True if date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const vietnameseTomorrow = new Date(tomorrow.toLocaleString('en-US', { timeZone: VIETNAMESE_TIMEZONE }));
  const vietnameseDate = new Date(date.toLocaleString('en-US', { timeZone: VIETNAMESE_TIMEZONE }));
  
  return vietnameseTomorrow.toDateString() === vietnameseDate.toDateString();
}

/**
 * Get current time in Vietnamese timezone
 * @returns Current date/time in Vietnamese timezone
 */
export function getCurrentVietnameseTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: VIETNAMESE_TIMEZONE }));
}
