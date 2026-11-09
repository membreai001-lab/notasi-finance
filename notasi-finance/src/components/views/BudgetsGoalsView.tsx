import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate } from '../../utils/formatters';
import {
  PiggyBank,
  Target,
  Plus,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Edit2,
  Trash2,
  Shield,
  Laptop,
  Plane,
  Home,
  Car,
  Heart,
  Calendar,
} from 'lucide-react';

export const BudgetsGoalsView: React.FC = () => {
  const {
    budgets,
    savingsGoals,
    categorySpendingCurrentMonth,
    settings,
    openBudgetModal,
    deleteBudget,
    openGoalModal,
    deleteSavingsGoal,
    openDepositModal,
  } = useFinance();

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'Plane':
        return <Plane className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  // Compute total budgeted vs total spent in budgeted categories
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpentInBudgets = budgets.reduce(
    (sum, b) => sum + (categorySpendingCurrentMonth[b.category] || 0),
    0
  );
  const overallBudgetRatio = totalBudgeted > 0 ? (totalSpentInBudgets / totalBudgeted) * 100 : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E9E9E7] dark:border-[#262626] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352F] dark:text-white">
            Anggaran & Target Tabungan
          </h1>
          <p className="text-xs text-[#787774] dark:text-[#888888]">
            Kontrol batas pengeluaran bulanan dan pantau progres dana impian Anda
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openBudgetModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#E9E9E7] dark:border-[#303030] text-[#37352F] dark:text-[#E6E6E5] hover:bg-[#EAEAEA] dark:hover:bg-[#252525] transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Atur Batas Anggaran</span>
          </button>
          <button
            onClick={() => openGoalModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#191919] text-white dark:bg-white dark:text-[#191919] hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Target Impian Baru</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ANGGARAN BULANAN (MONTHLY BUDGETS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#37352F] dark:text-white flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Batas Anggaran Kategori Bulanan</span>
            </h2>
            <p className="text-xs text-[#787774] dark:text-[#888888]">
              Pagu pengeluaran untuk menjaga disiplin keuangan
            </p>
          </div>

          <div className="text-xs font-mono text-[#787774] dark:text-[#9B9B9B]">
            Total Pagu:{' '}
            <span className="font-bold text-[#37352F] dark:text-white">
              {formatCurrency(totalBudgeted, settings.currency)}
            </span>
          </div>
        </div>

        {/* Overall Budget Meter */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#37352F] dark:text-white">
              Total Pengeluaran dari Seluruh Anggaran
            </span>
            <span className="font-mono tabular-nums font-bold text-[#37352F] dark:text-white">
              {Math.round(overallBudgetRatio)}% terpakai
            </span>
          </div>

          <div className="h-2 w-full bg-[#EAEAEA] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallBudgetRatio > 100
                  ? 'bg-rose-500'
                  : overallBudgetRatio > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, overallBudgetRatio)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#787774] dark:text-[#888888]">
            <span>Terpakai: {formatCurrency(totalSpentInBudgets, settings.currency)}</span>
            <span>
              Sisa Batas:{' '}
              {formatCurrency(Math.max(0, totalBudgeted - totalSpentInBudgets), settings.currency)}
            </span>
          </div>
        </div>

        {/* Category Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spent = categorySpendingCurrentMonth[b.category] || 0;
            const ratio = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
            const isExceeded = spent > b.monthlyLimit;
            const isNearLimit = ratio >= (b.alertThreshold || 0.8) * 100;

            return (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-[#37352F] dark:text-white truncate">
                      {b.category}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openBudgetModal(b)}
                        className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white"
                        title="Edit Anggaran"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus anggaran untuk ${b.category}?`)) {
                            deleteBudget(b.id);
                          }
                        }}
                        className="p-1 rounded text-[#787774] hover:text-rose-600 dark:hover:text-rose-400"
                        title="Hapus Anggaran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-lg font-bold font-mono tabular-nums text-[#37352F] dark:text-white">
                      {formatCurrency(spent, settings.currency)}
                    </p>
                    <p className="text-xs font-mono text-[#787774] dark:text-[#888888]">
                      / {formatCurrency(b.monthlyLimit, settings.currency)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-[#EAEAEA] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isExceeded ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, ratio)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={`font-semibold ${
                        isExceeded
                          ? 'text-rose-600 dark:text-rose-400 flex items-center gap-1'
                          : isNearLimit
                          ? 'text-amber-600 dark:text-amber-400 flex items-center gap-1'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExceeded && <AlertTriangle className="w-3 h-3" />}
                      {Math.round(ratio)}% terpakai
                    </span>
                    <span className="text-[#787774] dark:text-[#888888]">
                      {isExceeded
                        ? `Melebihi ${formatCurrency(spent - b.monthlyLimit, settings.currency)}`
                        : `Sisa ${formatCurrency(b.monthlyLimit - spent, settings.currency)}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: TARGET TABUNGAN / IMPIAN (SAVINGS GOALS) */}
      <section className="space-y-4 pt-4 border-t border-[#E9E9E7] dark:border-[#262626]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#37352F] dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Target Tabungan & Dana Impian</span>
            </h2>
            <p className="text-xs text-[#787774] dark:text-[#888888]">
              Wujudkan tujuan finansial jangka pendek dan jangka panjang
            </p>
          </div>

          <button
            onClick={() => openGoalModal()}
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Target
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savingsGoals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div
                key={goal.id}
                className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs flex flex-col justify-between space-y-4 group relative"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: goal.color }}
                      >
                        {getGoalIcon(goal.icon)}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-semibold text-[#37352F] dark:text-white truncate">
                          {goal.title}
                        </h3>
                        <p className="text-[11px] text-[#787774] dark:text-[#888888] truncate">
                          {goal.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openGoalModal(goal)}
                        className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white"
                        title="Edit Target"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus target "${goal.title}"?`)) {
                            deleteSavingsGoal(goal.id);
                          }
                        }}
                        className="p-1 rounded text-[#787774] hover:text-rose-600 dark:hover:text-rose-400"
                        title="Hapus Target"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[#787774] dark:text-[#888888]">
                        Terkumpul
                      </p>
                      <p className="text-xl font-bold font-mono tabular-nums text-[#37352F] dark:text-white">
                        {formatCurrency(goal.currentAmount, settings.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-semibold text-[#787774] dark:text-[#888888]">
                        Target
                      </p>
                      <p className="text-xs font-mono font-medium text-[#787774] dark:text-[#A3A3A3]">
                        {formatCurrency(goal.targetAmount, settings.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {percent}% tercapai
                    </span>
                    <span className="text-[11px] text-[#787774] dark:text-[#888888] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {goal.targetDate}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-[#EAEAEA] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Target Tercapai!
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#787774] dark:text-[#888888]">
                        Kurang {formatCurrency(goal.targetAmount - goal.currentAmount, settings.currency)}
                      </span>
                    )}

                    <button
                      onClick={() => openDepositModal(goal)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Setor Dana</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
