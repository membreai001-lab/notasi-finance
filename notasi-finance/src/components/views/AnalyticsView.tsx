import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { DEFAULT_CATEGORIES } from '../../types/finance';
import { formatCurrency, getCurrentPeriod } from '../../utils/formatters';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    transactions,
    settings,
    currentMonthIncome,
    currentMonthExpense,
    currentMonthNet,
    savingsRate,
    categorySpendingCurrentMonth,
  } = useFinance();

  const currentPeriod = getCurrentPeriod();

  // Sort categories by expenditure
  const categoryRanking = useMemo(() => {
    return Object.entries(categorySpendingCurrentMonth)
      .map(([cat, amount]) => {
        const def = DEFAULT_CATEGORIES.find((c) => c.name === cat);
        const percent = currentMonthExpense > 0 ? (amount / currentMonthExpense) * 100 : 0;
        return {
          name: cat,
          amount,
          percent: Math.round(percent),
          color: def?.color || '#64748B',
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [categorySpendingCurrentMonth, currentMonthExpense]);

  // Daily average spending this month
  const today = new Date();
  const currentDay = today.getDate();
  const dailyAverageExpense = currentDay > 0 ? currentMonthExpense / currentDay : 0;

  // Monthly Cashflow breakdown across the last 6 months
  const monthlyTrends = useMemo(() => {
    const monthsMap: Record<string, { income: number; expense: number }> = {};
    
    // Initialize current + previous 5 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsMap[key] = { income: 0, expense: 0 };
    }

    transactions.forEach((tx) => {
      const txMonth = tx.date.substring(0, 7);
      if (monthsMap[txMonth]) {
        if (tx.type === 'income') monthsMap[txMonth].income += tx.amount;
        if (tx.type === 'expense') monthsMap[txMonth].expense += tx.amount;
      }
    });

    const maxVal = Math.max(
      ...Object.values(monthsMap).flatMap((m) => [m.income, m.expense]),
      1
    );

    return Object.entries(monthsMap).map(([period, data]) => {
      const [y, m] = period.split('-');
      const label = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(
        new Date(Number(y), Number(m) - 1, 1)
      );
      return {
        period,
        label,
        income: data.income,
        expense: data.expense,
        incomeHeight: (data.income / maxVal) * 100,
        expenseHeight: (data.expense / maxVal) * 100,
      };
    });
  }, [transactions, today]);

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="border-b border-[#E9E9E7] dark:border-[#262626] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352F] dark:text-white">
          Analisis & Laporan Arus Kas
        </h1>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Visualisasi performa keuangan, rasio tabungan, dan distribusi pengeluaran
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mb-1">
            Rata-rata Pengeluaran Harian
          </p>
          <p className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {formatCurrency(dailyAverageExpense, settings.currency)} / hari
          </p>
          <p className="text-[11px] text-[#787774] dark:text-[#888888] mt-1">
            Dihitung dari {currentDay} hari berjalan bulan ini
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mb-1">
            Tingkat Tabungan (Savings Rate)
          </p>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {savingsRate}%
          </p>
          <p className="text-[11px] text-[#787774] dark:text-[#888888] mt-1">
            {savingsRate >= 20 ? 'Kondisi prima (target ideal ≥ 20%)' : 'Tingkatkan simpanan'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mb-1">
            Surplus / Defisit Bulan Ini
          </p>
          <p
            className={`text-xl font-bold font-mono tabular-nums ${
              currentMonthNet >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(currentMonthNet, settings.currency)}
          </p>
          <p className="text-[11px] text-[#787774] dark:text-[#888888] mt-1">
            Total arus masuk dikurangi keluar
          </p>
        </div>
      </div>

      {/* Chart: 6-Month Cashflow Trend */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
              Tren Arus Kas 6 Bulan Terakhir
            </h3>
            <p className="text-xs text-[#787774] dark:text-[#888888]">
              Perbandingan historis antara pemasukan vs pengeluaran
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Pemasukan
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Pengeluaran
            </span>
          </div>
        </div>

        {/* Clean SVG / Bar Chart Representation */}
        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 border-b border-[#E9E9E7] dark:border-[#2C2C2C] px-2 sm:px-6">
            {monthlyTrends.map((col) => (
              <div key={col.period} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                  {/* Income Bar */}
                  <div
                    className="w-full max-w-[20px] bg-emerald-500/80 hover:bg-emerald-500 rounded-t transition-all relative"
                    style={{ height: `${Math.max(col.incomeHeight, 4)}%` }}
                    title={`Pemasukan: ${formatCurrency(col.income, settings.currency)}`}
                  />
                  {/* Expense Bar */}
                  <div
                    className="w-full max-w-[20px] bg-rose-500/80 hover:bg-rose-500 rounded-t transition-all relative"
                    style={{ height: `${Math.max(col.expenseHeight, 4)}%` }}
                    title={`Pengeluaran: ${formatCurrency(col.expense, settings.currency)}`}
                  />
                </div>
                <span className="mt-2 text-[11px] font-mono font-medium text-[#787774] dark:text-[#888888] truncate">
                  {col.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown: Spending by Category Ranking */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
            Distribusi Pengeluaran Berdasarkan Kategori
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#888888]">
            Urutan pos belanja terbesar pada bulan berjalan
          </p>
        </div>

        {categoryRanking.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#787774] dark:text-[#888888]">
            Belum ada pengeluaran pada bulan ini untuk dianalisis.
          </p>
        ) : (
          <div className="space-y-3">
            {categoryRanking.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-[#37352F] dark:text-white truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono tabular-nums shrink-0">
                    <span className="font-bold text-[#37352F] dark:text-white">
                      {formatCurrency(item.amount, settings.currency)}
                    </span>
                    <span className="text-[#787774] dark:text-[#888888] text-[11px]">
                      ({item.percent}%)
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[#EAEAEA] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
