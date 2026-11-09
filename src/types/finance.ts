export type Currency = 'IDR' | 'USD' | 'EUR' | 'SGD' | 'JPY' | 'GBP';

export type AccountType = 'cash' | 'bank' | 'ewallet' | 'investment' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  color: string;
  accountNumber?: string;
  institution?: string;
  isArchived?: boolean;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  accountId: string;
  toAccountId?: string; // used when type === 'transfer'
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  tags?: string[];
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  period: string; // YYYY-MM
  alertThreshold?: number; // e.g. 0.8 for 80%
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  color: string;
  icon: string;
  isCompleted?: boolean;
}

export interface AppSettings {
  currency: Currency;
  theme: 'dark' | 'light' | 'system';
  userName: string;
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'D MMMM YYYY';
  syncCode?: string;
  lastBackupAt?: string;
}

export interface CategoryDefinition {
  name: string;
  color: string;
  iconName: string;
  type: 'expense' | 'income' | 'both';
}

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  // Expense Categories
  { name: 'Makanan & Minuman', color: '#F59E0B', iconName: 'Utensils', type: 'expense' },
  { name: 'Transportasi & Bensin', color: '#3B82F6', iconName: 'Car', type: 'expense' },
  { name: 'Tempat Tinggal & Kos', color: '#8B5CF6', iconName: 'Home', type: 'expense' },
  { name: 'Belanja & Kebutuhan', color: '#EC4899', iconName: 'ShoppingBag', type: 'expense' },
  { name: 'Tagihan & Langganan', color: '#6366F1', iconName: 'Receipt', type: 'expense' },
  { name: 'Kesehatan & Medis', color: '#EF4444', iconName: 'HeartPulse', type: 'expense' },
  { name: 'Hiburan & Liburan', color: '#14B8A6', iconName: 'Film', type: 'expense' },
  { name: 'Pendidikan & Buku', color: '#10B981', iconName: 'BookOpen', type: 'expense' },
  { name: 'Pribadi & Donasi', color: '#84CC16', iconName: 'Smile', type: 'expense' },
  { name: 'Pengeluaran Lain', color: '#64748B', iconName: 'MoreHorizontal', type: 'expense' },

  // Income Categories
  { name: 'Gaji Utama', color: '#10B981', iconName: 'Briefcase', type: 'income' },
  { name: 'Freelance & Proyek', color: '#06B6D4', iconName: 'Laptop', type: 'income' },
  { name: 'Investasi & Dividen', color: '#8B5CF6', iconName: 'TrendingUp', type: 'income' },
  { name: 'Bisnis & Penjualan', color: '#F59E0B', iconName: 'Store', type: 'income' },
  { name: 'Bonus & THR', color: '#EC4899', iconName: 'Gift', type: 'income' },
  { name: 'Pemasukan Lain', color: '#64748B', iconName: 'PlusCircle', type: 'income' },
];

export const CURRENCY_CONFIGS: Record<Currency, { symbol: string; code: string; label: string; rateToIDR: number }> = {
  IDR: { symbol: 'Rp', code: 'IDR', label: 'Rupiah Indonesia (IDR)', rateToIDR: 1 },
  USD: { symbol: '$', code: 'USD', label: 'US Dollar (USD)', rateToIDR: 16000 },
  EUR: { symbol: '€', code: 'EUR', label: 'Euro (EUR)', rateToIDR: 17200 },
  SGD: { symbol: 'S$', code: 'SGD', label: 'Singapore Dollar (SGD)', rateToIDR: 12100 },
  JPY: { symbol: '¥', code: 'JPY', label: 'Japanese Yen (JPY)', rateToIDR: 105 },
  GBP: { symbol: '£', code: 'GBP', label: 'British Pound (GBP)', rateToIDR: 20500 },
};
