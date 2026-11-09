import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Account, AccountType } from '../../types/finance';
import { formatCurrency, formatHumanDate } from '../../utils/formatters';
import {
  Wallet,
  Building,
  CreditCard,
  Coins,
  TrendingUp,
  Plus,
  ArrowRightLeft,
  Edit2,
  Trash2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const AccountsView: React.FC = () => {
  const {
    accounts,
    netWorth,
    transactions,
    settings,
    openAccountModal,
    openTransferModal,
    openTransactionModal,
    deleteAccount,
  } = useFinance();

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'bank':
        return <Building className="w-4 h-4" />;
      case 'ewallet':
        return <CreditCard className="w-4 h-4" />;
      case 'investment':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const accountTransactions = selectedAccountId
    ? transactions.filter(
        (t) => t.accountId === selectedAccountId || t.toAccountId === selectedAccountId
      )
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E9E9E7] dark:border-[#262626] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352F] dark:text-white">
            Dompet & Rekening
          </h1>
          <p className="text-xs text-[#787774] dark:text-[#888888]">
            Kelola multi-kantong keuangan: Tunai, Bank, E-Wallet, dan Investasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openTransferModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#E9E9E7] dark:border-[#303030] text-[#37352F] dark:text-[#E6E6E5] hover:bg-[#EAEAEA] dark:hover:bg-[#252525] transition-colors whitespace-nowrap"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
            <span>Transfer Antar Dompet</span>
          </button>
          <button
            onClick={() => openAccountModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#191919] text-white dark:bg-white dark:text-[#191919] hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Dompet</span>
          </button>
        </div>
      </div>

      {/* Net Worth Top Overview Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mb-1">
            Total Saldo Bersih Semua Akun
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#37352F] dark:text-white">
            {formatCurrency(netWorth, settings.currency)}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data tersimpan aman di penyimpanan lokal perangkat</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openTransferModal()}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            Kirim Saldo Antar Dompet
          </button>
        </div>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const share = netWorth > 0 ? Math.round((acc.balance / netWorth) * 100) : 0;
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                selectedAccountId === acc.id
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-[#202020] border-[#E9E9E7] dark:border-[#2C2C2C] hover:border-[#C4C4C2] dark:hover:border-[#444444]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: acc.color }}
                    >
                      {getAccountIcon(acc.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#37352F] dark:text-white">
                        {acc.name}
                      </h3>
                      <p className="text-[11px] text-[#787774] dark:text-[#888888]">
                        {acc.institution || acc.type.toUpperCase()}{' '}
                        {acc.accountNumber ? `· ${acc.accountNumber}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAccountModal(acc);
                      }}
                      className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white"
                      title="Edit Dompet"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {accounts.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus dompet "${acc.name}"?`)) {
                            deleteAccount(acc.id);
                          }
                        }}
                        className="p-1 rounded text-[#787774] hover:text-rose-600 dark:hover:text-rose-400"
                        title="Hapus Dompet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] uppercase font-semibold text-[#787774] dark:text-[#888888]">
                    Saldo Saat Ini
                  </p>
                  <p className="text-xl font-bold font-mono tabular-nums text-[#37352F] dark:text-white">
                    {formatCurrency(acc.balance, settings.currency)}
                  </p>
                </div>
              </div>

              {/* Share of Net Worth */}
              <div className="pt-2 border-t border-[#E9E9E7] dark:border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#787774] dark:text-[#888888]">
                <span>Porsi Portofolio:</span>
                <span className="font-mono font-medium text-[#37352F] dark:text-white">
                  {share}% dari aset
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Specific Transaction History Drawer/Section */}
      {selectedAccount && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#37352F] dark:text-white flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selectedAccount.color }}
                />
                Riwayat Transaksi: {selectedAccount.name}
              </h3>
              <p className="text-xs text-[#787774] dark:text-[#888888]">
                Semua arus keluar dan masuk untuk rekening ini
              </p>
            </div>
            <button
              onClick={() => setSelectedAccountId(null)}
              className="text-xs text-[#787774] hover:text-[#37352F] dark:text-[#888888] dark:hover:text-white"
            >
              Tutup Riwayat
            </button>
          </div>

          <div className="divide-y divide-[#E9E9E7] dark:divide-[#282828]">
            {accountTransactions.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#787774] dark:text-[#888888]">
                Belum ada transaksi pada dompet ini.
              </p>
            ) : (
              accountTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-[#F9F9F8] dark:hover:bg-[#252525] -mx-2 px-2 rounded-md transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#37352F] dark:text-white">
                      {tx.note || tx.category}
                    </p>
                    <p className="text-[11px] text-[#787774] dark:text-[#888888]">
                      {formatHumanDate(tx.date)} · {tx.category}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      tx.type === 'income' || (tx.type === 'transfer' && tx.toAccountId === selectedAccount.id)
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' || (tx.type === 'transfer' && tx.toAccountId === selectedAccount.id)
                      ? '+'
                      : '-'}
                    {formatCurrency(tx.amount, settings.currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
