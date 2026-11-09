import { Currency, CURRENCY_CONFIGS } from '../types/finance';

/**
 * Format numeric value to selected currency representation
 */
export function formatCurrency(amount: number, currency: Currency = 'IDR'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.IDR;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formattedNumber = '';

  if (currency === 'IDR') {
    // Indonesian Rupiah: No decimals typically needed for general tracking
    formattedNumber = new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(absAmount);
  } else if (currency === 'JPY') {
    formattedNumber = new Intl.NumberFormat('ja-JP', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(absAmount);
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(absAmount);
  }

  const prefix = isNegative ? '-' : '';
  return `${prefix}${config.symbol} ${formattedNumber}`;
}

/**
 * Format relative dates like "Hari ini", "Kemarin", or "12 Nov 2026"
 */
export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = todayOnly.getTime() - targetDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays === -1) return 'Besok';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: targetDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  }).format(targetDate);
}

/**
 * Format date for detailed display: "Kamis, 12 November 2026"
 */
export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(targetDate);
}

/**
 * Get current date as YYYY-MM-DD
 */
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current year-month as YYYY-MM
 */
export function getCurrentPeriod(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Generate a clean unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}
