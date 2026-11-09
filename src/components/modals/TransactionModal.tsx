import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionType, DEFAULT_CATEGORIES } from '../../types/finance';
import { getTodayString, formatCurrency } from '../../utils/formatters';
import { X, ArrowRightLeft, ArrowDownRight, ArrowUpRight, Calendar, Tag, FileText } from 'lucide-react';

export const TransactionModal: React.FC = () => {
  const {
    isTransactionModalOpen,
    closeTransactionModal,
    editingTransaction,
    addTransaction,
    updateTransaction,
    accounts,
    settings,
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [toAccountId, setToAccountId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  const [note, setNote] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setAccountId(editingTransaction.accountId);
      setToAccountId(editingTransaction.toAccountId || '');
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
      setTagsInput(editingTransaction.tags ? editingTransaction.tags.join(', ') : '');
    } else {
      setType('expense');
      setAmount('');
      setAccountId(accounts[0]?.id || '');
      setToAccountId(accounts[1]?.id || '');
      setCategory('Makanan & Minuman');
      setDate(getTodayString());
      setNote('');
      setTagsInput('');
    }
  }, [editingTransaction, isTransactionModalOpen, accounts]);

  if (!isTransactionModalOpen) return null;

  const filteredCategories = DEFAULT_CATEGORIES.filter((cat) => {
    if (type === 'expense') return cat.type === 'expense' || cat.type === 'both';
    if (type === 'income') return cat.type === 'income' || cat.type === 'both';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (!accountId) return;
    if (type === 'transfer' && (!toAccountId || toAccountId === accountId)) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        type,
        amount: numAmount,
        currency: settings.currency,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        category: type === 'transfer' ? 'Transfer Antar Dompet' : category,
        date,
        note: note.trim() || undefined,
        tags: tags.length ? tags : undefined,
      });
    } else {
      addTransaction({
        type,
        amount: numAmount,
        currency: settings.currency,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        category: type === 'transfer' ? 'Transfer Antar Dompet' : category,
        date,
        note: note.trim() || undefined,
        tags: tags.length ? tags : undefined,
      });
    }

    closeTransactionModal();
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#303030] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#E9E9E7] dark:border-[#2C2C2C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
              {editingTransaction ? 'Edit Catatan' : 'Catat Transaksi'}
            </span>
          </div>
          <button
            onClick={closeTransactionModal}
            className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Segmented Type Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F5F5F4] dark:bg-[#191919] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Makanan & Minuman');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                type === 'expense'
                  ? 'bg-white dark:bg-[#2C2C2C] text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-[#787774] dark:text-[#9B9B9B]'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Gaji Utama');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                type === 'income'
                  ? 'bg-white dark:bg-[#2C2C2C] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-[#787774] dark:text-[#9B9B9B]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Pemasukan</span>
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                type === 'transfer'
                  ? 'bg-white dark:bg-[#2C2C2C] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-[#787774] dark:text-[#9B9B9B]'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Nominal Transaksi ({settings.currency})
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white placeholder-[#B4B4B4] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {parsedAmount > 0 && (
              <p className="mt-1 text-xs font-mono text-[#787774] dark:text-[#888888]">
                Terbaca: <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">{formatCurrency(parsedAmount, settings.currency)}</span>
              </p>
            )}
          </div>

          {/* Account Selectors */}
          {type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                  Dari Dompet
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance, settings.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                  Ke Dompet Tujuan
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id} disabled={acc.id === accountId}>
                      {acc.name} {acc.id === accountId ? '(Sama)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                Dompet / Rekening
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Saldo: {formatCurrency(acc.balance, settings.currency)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Selector (For Expense & Income) */}
          {type !== 'transfer' && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                Kategori
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#F9F9F8] dark:bg-[#191919] rounded-lg border border-[#E9E9E7] dark:border-[#303030]">
                {filteredCategories.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-left transition-colors truncate ${
                        isSelected
                          ? 'bg-white dark:bg-[#2F2F2F] font-semibold text-[#37352F] dark:text-white shadow-xs'
                          : 'text-[#787774] dark:text-[#9B9B9B] hover:bg-white/50 dark:hover:bg-[#252525]'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate text-[11px]">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Tanggal Transaksi
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Catatan / Keterangan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Belanja bahan mingguan, makan siang..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white placeholder-[#999999] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Label / Tags (Opsional, pisahkan koma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Contoh: kuliner, ngopi, kerja"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white placeholder-[#999999] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E9E9E7] dark:border-[#2C2C2C]">
            <button
              type="button"
              onClick={closeTransactionModal}
              className="px-4 py-2 text-xs font-medium rounded-lg text-[#787774] hover:text-[#37352F] dark:text-[#9B9B9B] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#191919] text-white hover:bg-[#2F2F2F] dark:bg-white dark:text-[#191919] dark:hover:bg-[#EAEAEA] transition-colors shadow-xs"
            >
              {editingTransaction ? 'Simpan Perubahan' : 'Tambah Catatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
