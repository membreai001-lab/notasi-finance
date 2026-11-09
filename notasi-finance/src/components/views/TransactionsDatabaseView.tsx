import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType, DEFAULT_CATEGORIES } from '../../types/finance';
import { formatCurrency, formatHumanDate, formatFullDate } from '../../utils/formatters';
import {
  Search,
  Filter,
  Calendar,
  Table as TableIcon,
  LayoutGrid,
  Plus,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

type DatabaseViewMode = 'table' | 'calendar' | 'board';

export const TransactionsDatabaseView: React.FC = () => {
  const {
    transactions,
    accounts,
    settings,
    openTransactionModal,
    deleteTransaction,
    batchDeleteTransactions,
  } = useFinance();

  const [viewMode, setViewMode] = useState<DatabaseViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(() => new Date());

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

      // Account filter
      if (accountFilter !== 'all' && tx.accountId !== accountFilter && tx.toAccountId !== accountFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNote = tx.note?.toLowerCase().includes(query);
        const matchCategory = tx.category.toLowerCase().includes(query);
        const matchTags = tx.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchNote && !matchCategory && !matchTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, typeFilter, categoryFilter, accountFilter, searchQuery, sortBy]);

  // Aggregate stats of filtered transactions
  const totalFilteredIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalFilteredExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedTxIds.length === filteredTransactions.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(filteredTransactions.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedTxIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    if (confirm(`Hapus ${selectedTxIds.length} catatan transaksi yang dipilih?`)) {
      batchDeleteTransactions(selectedTxIds);
      setSelectedTxIds([]);
    }
  };

  // Calendar calculations
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
    // Padding before 1st of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }
    return days;
  }, [year, month, firstDayOfMonth, daysInMonth]);

  // Map transactions to calendar dates
  const transactionsByDate = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      if (!map[tx.date]) map[tx.date] = [];
      map[tx.date].push(tx);
    });
    return map;
  }, [transactions]);

  return (
    <div className="space-y-4 pb-12">
      {/* View Header with Notion-style View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E9E9E7] dark:border-[#262626] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352F] dark:text-white">
            Database Transaksi
          </h1>
          <p className="text-xs text-[#787774] dark:text-[#888888]">
            Kelola dan filter seluruh catatan keuangan Anda
          </p>
        </div>

        {/* View Mode Switcher (Notion-style Database Views) */}
        <div className="flex items-center gap-1 p-1 bg-[#EAEAEA] dark:bg-[#252525] rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
                : 'text-[#787774] dark:text-[#9B9B9B] hover:text-[#37352F] dark:hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabel</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
                : 'text-[#787774] dark:text-[#9B9B9B] hover:text-[#37352F] dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kalender</span>
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'board'
                ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
                : 'text-[#787774] dark:text-[#9B9B9B] hover:text-[#37352F] dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kategori</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#787774] dark:text-[#888888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, catatan, atau tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#333333] bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#333333] bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none"
            >
              <option value="all">Semua Tipe</option>
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
              <option value="transfer">Transfer</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#333333] bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Account Filter */}
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#333333] bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none"
            >
              <option value="all">Semua Dompet</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#333333] bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none"
            >
              <option value="date-desc">Tanggal: Terbaru</option>
              <option value="date-asc">Tanggal: Terlama</option>
              <option value="amount-desc">Nominal: Terbesar</option>
              <option value="amount-asc">Nominal: Terkecil</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Strip */}
        {selectedTxIds.length > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
            <span className="font-medium text-rose-600 dark:text-rose-400">
              {selectedTxIds.length} catatan terpilih
            </span>
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: NOTION TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] dark:bg-[#1C1C1C] text-[#787774] dark:text-[#8F8F8F] border-b border-[#E9E9E7] dark:border-[#2C2C2C] select-none">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filteredTransactions.length > 0 &&
                        selectedTxIds.length === filteredTransactions.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-[#C5C5C5] text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="p-3 font-semibold">Tanggal</th>
                  <th className="p-3 font-semibold">Keterangan</th>
                  <th className="p-3 font-semibold">Kategori</th>
                  <th className="p-3 font-semibold">Dompet / Rekening</th>
                  <th className="p-3 font-semibold text-right">Nominal</th>
                  <th className="p-3 font-semibold text-right w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E9E7] dark:divide-[#282828]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#787774] dark:text-[#888888]">
                      Tidak ada catatan transaksi yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isSelected = selectedTxIds.includes(tx.id);
                    const account = accounts.find((a) => a.id === tx.accountId);
                    const toAccount = accounts.find((a) => a.id === tx.toAccountId);

                    return (
                      <tr
                        key={tx.id}
                        className={`hover:bg-[#F9F9F8] dark:hover:bg-[#252525] transition-colors ${
                          isSelected ? 'bg-emerald-500/5 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(tx.id)}
                            className="rounded border-[#C5C5C5] text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="p-3 text-[#787774] dark:text-[#9B9B9B] font-mono tabular-nums whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="p-3 font-medium text-[#37352F] dark:text-white max-w-xs truncate">
                          {tx.note || tx.category}
                        </td>
                        <td className="p-3 text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  DEFAULT_CATEGORIES.find((c) => c.name === tx.category)?.color ||
                                  '#64748B',
                              }}
                            />
                            <span>{tx.category}</span>
                          </span>
                        </td>
                        <td className="p-3 text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">
                          {tx.type === 'transfer' ? (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              {account?.name} → {toAccount?.name}
                            </span>
                          ) : (
                            <span className="font-mono text-[11px]">{account?.name}</span>
                          )}
                        </td>
                        <td
                          className={`p-3 font-mono font-bold tabular-nums text-right whitespace-nowrap ${
                            tx.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : tx.type === 'expense'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                          {formatCurrency(tx.amount, settings.currency)}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openTransactionModal(tx)}
                              className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
                              title="Edit Catatan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Hapus transaksi ini?')) {
                                  deleteTransaction(tx.id);
                                }
                              }}
                              className="p-1 rounded text-[#787774] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary Footer */}
          <div className="p-3 bg-[#F7F7F5] dark:bg-[#1C1C1C] border-t border-[#E9E9E7] dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
            <span className="text-[#787774] dark:text-[#888888]">
              Menampilkan {filteredTransactions.length} dari {transactions.length} catatan
            </span>
            <div className="flex items-center gap-4 text-right">
              <span className="text-emerald-600 dark:text-emerald-400">
                Pemasukan: +{formatCurrency(totalFilteredIncome, settings.currency)}
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                Pengeluaran: -{formatCurrency(totalFilteredExpense, settings.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: NOTION CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] rounded-xl shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
              {new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
                calendarDate
              )}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                className="p-1.5 rounded hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] text-[#787774] dark:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCalendarDate(new Date())}
                className="px-2.5 py-1 text-xs rounded hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] text-[#787774] dark:text-white font-medium"
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                className="p-1.5 rounded hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] text-[#787774] dark:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div
                key={day}
                className="py-1 text-center text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#888888]"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={`empty_${idx}`}
                    className="min-h-[72px] sm:min-h-[88px] p-1.5 rounded-lg bg-[#FAFAFA] dark:bg-[#191919] opacity-40 border border-transparent"
                  />
                );
              }

              const dayTxList = transactionsByDate[cell.dateStr] || [];
              const dayIncome = dayTxList
                .filter((t) => t.type === 'income')
                .reduce((s, t) => s + t.amount, 0);
              const dayExpense = dayTxList
                .filter((t) => t.type === 'expense')
                .reduce((s, t) => s + t.amount, 0);

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => openTransactionModal()}
                  className="min-h-[72px] sm:min-h-[88px] p-1.5 rounded-lg border border-[#E9E9E7] dark:border-[#2A2A2A] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 bg-white dark:bg-[#1E1E1E] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#37352F] dark:text-white">
                      {cell.dayNum}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-600 dark:text-emerald-400">
                      +
                    </span>
                  </div>

                  <div className="space-y-0.5 text-[10px] font-mono tabular-nums">
                    {dayIncome > 0 && (
                      <p className="text-emerald-600 dark:text-emerald-400 truncate">
                        +{formatCurrency(dayIncome, settings.currency)}
                      </p>
                    )}
                    {dayExpense > 0 && (
                      <p className="text-rose-600 dark:text-rose-400 truncate">
                        -{formatCurrency(dayExpense, settings.currency)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: NOTION KANBAN BOARD GROUPED BY CATEGORY */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_CATEGORIES.map((cat) => {
            const catTransactions = filteredTransactions.filter((t) => t.category === cat.name);
            const total = catTransactions.reduce((s, t) => s + t.amount, 0);

            return (
              <div
                key={cat.name}
                className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E9E9E7] dark:border-[#2A2A2A]">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h4 className="text-xs font-semibold text-[#37352F] dark:text-white truncate">
                      {cat.name}
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold tabular-nums text-[#37352F] dark:text-white">
                    {formatCurrency(total, settings.currency)}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {catTransactions.length === 0 ? (
                    <p className="text-[11px] text-[#787774] dark:text-[#888888] py-2 text-center">
                      Belum ada transaksi
                    </p>
                  ) : (
                    catTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => openTransactionModal(tx)}
                        className="p-2 rounded-lg bg-[#F9F9F8] dark:bg-[#1C1C1C] border border-[#E9E9E7] dark:border-[#282828] hover:bg-white dark:hover:bg-[#262626] transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <p className="font-medium text-[#37352F] dark:text-white truncate">
                            {tx.note || tx.category}
                          </p>
                          <p className="text-[10px] text-[#787774] dark:text-[#888888]">
                            {tx.date}
                          </p>
                        </div>
                        <span
                          className={`font-mono tabular-nums font-bold shrink-0 ${
                            tx.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount, settings.currency)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
