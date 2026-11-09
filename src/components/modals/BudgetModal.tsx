import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { DEFAULT_CATEGORIES } from '../../types/finance';
import { getCurrentPeriod, formatCurrency } from '../../utils/formatters';
import { X, PiggyBank } from 'lucide-react';

export const BudgetModal: React.FC = () => {
  const {
    isBudgetModalOpen,
    closeBudgetModal,
    editingBudget,
    saveBudget,
    budgets,
    settings,
  } = useFinance();

  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('0.8');

  const expenseCategories = DEFAULT_CATEGORIES.filter((c) => c.type === 'expense' || c.type === 'both');

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setMonthlyLimit(String(editingBudget.monthlyLimit));
      setAlertThreshold(String(editingBudget.alertThreshold || 0.8));
    } else {
      // Find first category not yet budgeted
      const existingCategories = budgets.map((b) => b.category);
      const available = expenseCategories.find((c) => !existingCategories.includes(c.name));
      setCategory(available ? available.name : expenseCategories[0]?.name || '');
      setMonthlyLimit('');
      setAlertThreshold('0.8');
    }
  }, [editingBudget, isBudgetModalOpen, budgets]);

  if (!isBudgetModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(monthlyLimit);
    if (!category || isNaN(limit) || limit <= 0) return;

    saveBudget({
      id: editingBudget?.id,
      category,
      monthlyLimit: limit,
      period: getCurrentPeriod(),
      alertThreshold: parseFloat(alertThreshold) || 0.8,
    });

    closeBudgetModal();
  };

  const parsedLimit = parseFloat(monthlyLimit) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#303030] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-[#E9E9E7] dark:border-[#2C2C2C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
              {editingBudget ? 'Ubah Anggaran Bulanan' : 'Pasang Batas Anggaran'}
            </span>
          </div>
          <button
            onClick={closeBudgetModal}
            className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Kategori Pengeluaran
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {expenseCategories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Batas Maksimal Pengeluaran ({settings.currency} / Bulan)
            </label>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="Contoh: 1500000"
              className="w-full px-3 py-2.5 text-base font-mono font-bold tabular-nums rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {parsedLimit > 0 && (
              <p className="mt-1 text-xs font-mono text-[#787774] dark:text-[#888888]">
                {formatCurrency(parsedLimit, settings.currency)} per bulan
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Ambang Peringatan Pengeluaran
            </label>
            <select
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="0.7">Peringatkan saat mencapai 70%</option>
              <option value="0.8">Peringatkan saat mencapai 80% (Standar)</option>
              <option value="0.9">Peringatkan saat mencapai 90%</option>
              <option value="1.0">Peringatkan hanya saat melampaui 100%</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E9E9E7] dark:border-[#2C2C2C]">
            <button
              type="button"
              onClick={closeBudgetModal}
              className="px-4 py-2 text-xs font-medium rounded-lg text-[#787774] hover:text-[#37352F] dark:text-[#9B9B9B] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#191919] text-white hover:bg-[#2F2F2F] dark:bg-white dark:text-[#191919] dark:hover:bg-[#EAEAEA] transition-colors shadow-xs"
            >
              Simpan Anggaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
