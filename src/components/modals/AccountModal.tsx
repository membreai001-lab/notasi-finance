import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AccountType } from '../../types/finance';
import { X, Building, CreditCard, Coins, TrendingUp } from 'lucide-react';

const COLOR_OPTIONS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
  '#EF4444', // Red
];

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    closeAccountModal,
    editingAccount,
    addAccount,
    updateAccount,
    settings,
  } = useFinance();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [institution, setInstitution] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setType(editingAccount.type);
      setBalance(String(editingAccount.balance));
      setColor(editingAccount.color);
      setInstitution(editingAccount.institution || '');
      setAccountNumber(editingAccount.accountNumber || '');
    } else {
      setName('');
      setType('bank');
      setBalance('0');
      setColor(COLOR_OPTIONS[0]);
      setInstitution('');
      setAccountNumber('');
    }
  }, [editingAccount, isAccountModalOpen]);

  if (!isAccountModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const numBalance = parseFloat(balance) || 0;

    if (editingAccount) {
      updateAccount(editingAccount.id, {
        name: name.trim(),
        type,
        balance: numBalance,
        color,
        institution: institution.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
      });
    } else {
      addAccount({
        name: name.trim(),
        type,
        balance: numBalance,
        currency: settings.currency,
        color,
        institution: institution.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
      });
    }

    closeAccountModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#303030] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-[#E9E9E7] dark:border-[#2C2C2C] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
            {editingAccount ? 'Ubah Dompet / Rekening' : 'Tambah Dompet / Rekening'}
          </span>
          <button
            onClick={closeAccountModal}
            className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Nama Rekening / Dompet
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: BCA Tabungan, GoPay, Tunai..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Jenis Akun
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bank', label: 'Rekening Bank', icon: <Building className="w-3.5 h-3.5" /> },
                { id: 'ewallet', label: 'E-Wallet', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: 'cash', label: 'Uang Tunai', icon: <Coins className="w-3.5 h-3.5" /> },
                { id: 'investment', label: 'Investasi', icon: <TrendingUp className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as AccountType)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                    type === item.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-[#E9E9E7] dark:border-[#303030] text-[#787774] dark:text-[#9B9B9B] hover:bg-[#F7F7F5] dark:hover:bg-[#252525]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Saldo Sekarang ({settings.currency})
            </label>
            <input
              type="number"
              step="any"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                Penyedia / Bank
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Contoh: BCA, Mandiri"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                Nomor Akun (Opsional)
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Contoh: •••• 1234"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1.5">
              Warna Penanda
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-emerald-500 ring-offset-white dark:ring-offset-[#202020]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E9E9E7] dark:border-[#2C2C2C]">
            <button
              type="button"
              onClick={closeAccountModal}
              className="px-4 py-2 text-xs font-medium rounded-lg text-[#787774] hover:text-[#37352F] dark:text-[#9B9B9B] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#191919] text-white hover:bg-[#2F2F2F] dark:bg-white dark:text-[#191919] dark:hover:bg-[#EAEAEA] transition-colors shadow-xs"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
