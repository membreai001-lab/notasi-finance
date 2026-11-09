import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { X, PlusCircle, CheckCircle } from 'lucide-react';

export const DepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    closeDepositModal,
    selectedGoalForDeposit,
    depositToSavingsGoal,
    accounts,
    settings,
  } = useFinance();

  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  if (!isDepositModalOpen || !selectedGoalForDeposit) return null;

  const remaining = Math.max(0, selectedGoalForDeposit.targetAmount - selectedGoalForDeposit.currentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!accountId || isNaN(num) || num <= 0) return;

    depositToSavingsGoal(selectedGoalForDeposit.id, num, accountId);

    // If this deposit completes the goal, launch celebration confetti!
    if (selectedGoalForDeposit.currentAmount + num >= selectedGoalForDeposit.targetAmount) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B'],
        });
      } catch (e) {
        // Safe fallback
      }
    }

    closeDepositModal();
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#303030] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-[#E9E9E7] dark:border-[#2C2C2C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
              Tambah Tabungan
            </span>
          </div>
          <button
            onClick={closeDepositModal}
            className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-[#F9F9F8] dark:bg-[#191919] rounded-lg border border-[#E9E9E7] dark:border-[#2A2A2A]">
            <p className="text-[11px] text-[#787774] dark:text-[#888888]">Target Impian:</p>
            <p className="text-sm font-semibold text-[#37352F] dark:text-white truncate">
              {selectedGoalForDeposit.title}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E9E9E7] dark:border-[#2A2A2A] text-xs font-mono">
              <span className="text-[#787774] dark:text-[#888888]">Sisa kebutuhan:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(remaining, settings.currency)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Sumber Dompet
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {formatCurrency(acc.balance, settings.currency)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Nominal Setoran ({settings.currency})
            </label>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full px-3 py-2.5 text-base font-mono font-bold tabular-nums rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {parsedAmount > 0 && (
              <p className="mt-1 text-xs font-mono text-[#787774] dark:text-[#888888]">
                {formatCurrency(parsedAmount, settings.currency)}
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E9E9E7] dark:border-[#2C2C2C]">
            <button
              type="button"
              onClick={closeDepositModal}
              className="px-4 py-2 text-xs font-medium rounded-lg text-[#787774] hover:text-[#37352F] dark:text-[#9B9B9B] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Setor Tabungan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
