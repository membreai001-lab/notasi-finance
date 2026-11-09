import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRightLeft,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    netWorth,
    currentMonthIncome,
    currentMonthExpense,
    currentMonthNet,
    savingsRate,
    transactions,
    accounts,
    budgets,
    savingsGoals,
    categorySpendingCurrentMonth,
    settings,
    openTransactionModal,
    openTransferModal,
    openAccountModal,
    openDepositModal,
    setActiveView,
    deleteTransaction,
  } = useFinance();

  const recentTransactions = transactions.slice(0, 6);

  // Compute budget statuses
  const budgetAlerts = budgets.map((b) => {
    const spent = categorySpendingCurrentMonth[b.category] || 0;
    const ratio = b.monthlyLimit > 0 ? spent / b.monthlyLimit : 0;
    return {
      ...b,
      spent,
      ratio,
      isExceeded: spent > b.monthlyLimit,
      isNearLimit: ratio >= (b.alertThreshold || 0.8),
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Notion Workspace Banner / Top Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1 border-b border-[#E9E9E7] dark:border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#787774] dark:text-[#9B9B9B] mb-1">
            <span>Notasi Finance</span>
            <span aria-hidden="true">·</span>
            <span>Bulan Berjalan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352F] dark:text-white">
            Ikhtisar Keuangan Personal
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openTransferModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#E9E9E7] dark:border-[#303030] text-[#37352F] dark:text-[#E6E6E5] hover:bg-[#EAEAEA] dark:hover:bg-[#252525] transition-colors whitespace-nowrap"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
            <span>Transfer Dompet</span>
          </button>
          <button
            onClick={() => openTransactionModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#191919] text-white dark:bg-white dark:text-[#191919] hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Baru</span>
          </button>
        </div>
      </div>

      {/* 4-KPI Metric Strip (Net Worth, Income, Expense, Net Flow) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Net Worth Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9B9B] mb-2">
            <span>Kekayaan Bersih (Total Aset)</span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#37352F] dark:text-white">
            {formatCurrency(netWorth, settings.currency)}
          </p>
          <div className="mt-2 text-[11px] text-[#787774] dark:text-[#888888] flex items-center justify-between">
            <span>{accounts.length} dompet aktif</span>
            <button
              onClick={() => setActiveView('accounts')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center"
            >
              Kelola <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Current Month Income */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9B9B] mb-2">
            <span>Pemasukan Bulan Ini</span>
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(currentMonthIncome, settings.currency)}
          </p>
          <div className="mt-2 text-[11px] text-[#787774] dark:text-[#888888]">
            {transactions.filter((t) => t.type === 'income').length} transaksi diterima
          </div>
        </div>

        {/* Current Month Expense */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9B9B] mb-2">
            <span>Pengeluaran Bulan Ini</span>
            <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {formatCurrency(currentMonthExpense, settings.currency)}
          </p>
          <div className="mt-2 text-[11px] text-[#787774] dark:text-[#888888]">
            {transactions.filter((t) => t.type === 'expense').length} transaksi tercatat
          </div>
        </div>

        {/* Current Month Net Savings */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9B9B] mb-2">
            <span>Arus Kas Bersih (Surplus)</span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p
            className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
              currentMonthNet >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(currentMonthNet, settings.currency)}
          </p>
          <div className="mt-2 text-[11px] text-[#787774] dark:text-[#888888]">
            Tingkat Tabungan: <span className="font-semibold text-[#37352F] dark:text-white">{savingsRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Split: Cashflow Overview & Quick Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cashflow Bar Visualization */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
                Komposisi Arus Kas Bulan Berjalan
              </h3>
              <p className="text-xs text-[#787774] dark:text-[#888888]">
                Perbandingan total pemasukan terhadap total pengeluaran
              </p>
            </div>
            <button
              onClick={() => setActiveView('analytics')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Lihat Grafik Lengkap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Ratio Bar */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-[#EAEAEA] dark:bg-[#2C2C2C] rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${
                    currentMonthIncome + currentMonthExpense > 0
                      ? (currentMonthIncome / (currentMonthIncome + currentMonthExpense)) * 100
                      : 50
                  }%`,
                }}
                title={`Pemasukan: ${formatCurrency(currentMonthIncome, settings.currency)}`}
              />
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{
                  width: `${
                    currentMonthIncome + currentMonthExpense > 0
                      ? (currentMonthExpense / (currentMonthIncome + currentMonthExpense)) * 100
                      : 50
                  }%`,
                }}
                title={`Pengeluaran: ${formatCurrency(currentMonthExpense, settings.currency)}`}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Pemasukan: {formatCurrency(currentMonthIncome, settings.currency)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Pengeluaran: {formatCurrency(currentMonthExpense, settings.currency)}</span>
              </div>
            </div>
          </div>

          {/* Budget Health Monitor */}
          <div className="pt-3 border-t border-[#E9E9E7] dark:border-[#2C2C2C]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
                Pantauan Anggaran Teratas
              </h4>
              <button
                onClick={() => setActiveView('budgets')}
                className="text-[11px] text-[#787774] dark:text-[#9B9B9B] hover:text-[#37352F] dark:hover:text-white"
              >
                Semua Anggaran ({budgets.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {budgetAlerts.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-lg bg-[#F9F9F8] dark:bg-[#1C1C1C] border border-[#E9E9E7] dark:border-[#2A2A2A] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#37352F] dark:text-white truncate">
                      {b.category}
                    </span>
                    <span className="font-mono tabular-nums text-[11px] text-[#787774] dark:text-[#9B9B9B]">
                      {Math.round(b.ratio * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-[#E5E5E5] dark:bg-[#2D2D2D] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        b.isExceeded
                          ? 'bg-rose-500'
                          : b.isNearLimit
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, b.ratio * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#787774] dark:text-[#888888] font-mono">
                    <span>{formatCurrency(b.spent, settings.currency)}</span>
                    <span>Pagu: {formatCurrency(b.monthlyLimit, settings.currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Dompet & Rekening Card Strip */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
                Dompet & Rekening
              </h3>
              <button
                onClick={() => openAccountModal()}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>

            <div className="space-y-2">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => setActiveView('accounts')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E9E9E7] dark:border-[#2A2A2A] hover:bg-[#F9F9F8] dark:hover:bg-[#262626] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: acc.color }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-medium text-[#37352F] dark:text-white truncate">
                        {acc.name}
                      </p>
                      <p className="text-[10px] text-[#787774] dark:text-[#888888] truncate">
                        {acc.institution || acc.type}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#37352F] dark:text-[#E6E6E5]">
                    {formatCurrency(acc.balance, settings.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Target Tabungan Highlight */}
          {savingsGoals.length > 0 && (
            <div className="pt-3 border-t border-[#E9E9E7] dark:border-[#2C2C2C]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#787774] dark:text-[#9B9B9B]">
                  Target Tabungan Aktif
                </span>
                <button
                  onClick={() => setActiveView('budgets')}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              {savingsGoals.slice(0, 1).map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div
                    key={goal.id}
                    className="p-3 rounded-lg bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#37352F] dark:text-white truncate">
                        {goal.title}
                      </p>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {percent}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-[#E5E5E5] dark:bg-[#2D2D2D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#787774] dark:text-[#888888]">
                      <span>{formatCurrency(goal.currentAmount, settings.currency)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDepositModal(goal);
                        }}
                        className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        + Setor
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions List (Notion Table Format) */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
              Catatan Transaksi Terakhir
            </h3>
            <p className="text-xs text-[#787774] dark:text-[#888888]">
              Aktivitas finansial terbaru Anda
            </p>
          </div>
          <button
            onClick={() => setActiveView('transactions')}
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Buka Database Transaksi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs text-[#787774] dark:text-[#888888]">
              Belum ada catatan transaksi. Mulai catat keuangan Anda hari ini!
            </p>
            <button
              onClick={() => openTransactionModal()}
              className="px-3 py-1.5 text-xs font-medium bg-[#191919] text-white dark:bg-white dark:text-[#191919] rounded-md"
            >
              Catat Transaksi Pertama
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E9E9E7] dark:divide-[#2B2B2B]">
            {recentTransactions.map((tx) => {
              const account = accounts.find((a) => a.id === tx.accountId);
              const toAccount = accounts.find((a) => a.id === tx.toAccountId);
              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-[#F9F9F8] dark:hover:bg-[#262626] -mx-2 px-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'expense'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : tx.type === 'expense' ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowRightLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 truncate">
                      <p className="font-semibold text-[#37352F] dark:text-[#E6E6E5] truncate">
                        {tx.note || tx.category}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#787774] dark:text-[#888888] truncate">
                        <span>{formatHumanDate(tx.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tx.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">
                          {tx.type === 'transfer'
                            ? `${account?.name} → ${toAccount?.name}`
                            : account?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono font-bold tabular-nums ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'expense'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                      {formatCurrency(tx.amount, settings.currency)}
                    </p>
                    <button
                      onClick={() => openTransactionModal(tx)}
                      className="text-[10px] text-[#787774] dark:text-[#888888] hover:text-[#37352F] dark:hover:text-white"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
