import React from 'react';
import { useFinance, AppView } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { PWAInstallButton } from './PWAInstallButton';
import {
  LayoutDashboard,
  TableProperties,
  Wallet,
  PiggyBank,
  PieChart,
  Settings,
  Plus,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building,
  Coins,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeView,
    setActiveView,
    accounts,
    netWorth,
    settings,
    toggleTheme,
    openTransactionModal,
    openAccountModal,
  } = useFinance();

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Ikhtisar', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Database Transaksi', icon: <TableProperties className="w-4 h-4" /> },
    { id: 'accounts', label: 'Dompet & Rekening', icon: <Wallet className="w-4 h-4" /> },
    { id: 'budgets', label: 'Anggaran & Target', icon: <PiggyBank className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analisis Arus Kas', icon: <PieChart className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan & Cadangan', icon: <Settings className="w-4 h-4" /> },
  ];

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Building className="w-3.5 h-3.5" />;
      case 'ewallet':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'investment':
        return <TrendingUp className="w-3.5 h-3.5" />;
      default:
        return <Coins className="w-3.5 h-3.5" />;
    }
  };

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:static md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col bg-[#F7F7F5] dark:bg-[#191919] border-r border-[#E9E9E7] dark:border-[#2B2B2B] select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Brand Lockup */}
        <div className="p-3.5 border-b border-[#E9E9E7] dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#191919] dark:bg-white text-white dark:text-[#191919] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              N
            </div>
            <div className="truncate">
              <h1 className="text-xs font-semibold text-[#37352F] dark:text-[#E6E6E5] leading-tight truncate">
                Notasi Finance
              </h1>
              <p className="text-[10px] text-[#787774] dark:text-[#8F8F8F] truncate">
                {settings.userName}&apos;s Workspace
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleTheme()}
            className="p-1.5 rounded-md text-[#787774] hover:text-[#37352F] hover:bg-[#EAEAEA] dark:text-[#9B9B9B] dark:hover:text-[#E6E6E5] dark:hover:bg-[#2F2F2F] transition-colors"
            title="Ganti Tema Terang/Gelap"
            aria-label="Ganti Tema"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <button
            onClick={() => {
              openTransactionModal();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-[#191919] text-white hover:bg-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-[#E6E6E5] dark:hover:bg-[#3D3D3D] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Transaksi Baru</span>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#787774]">
            Halaman
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${
                  isActive
                    ? 'bg-[#EAEAEA] dark:bg-[#292929] text-[#37352F] dark:text-white font-semibold'
                    : 'text-[#37352F]/80 dark:text-[#E6E6E5]/80 hover:bg-[#EAEAEA]/60 dark:hover:bg-[#242424]'
                }`}
              >
                <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#787774] dark:text-[#888888]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Quick Wallets Section */}
          <div className="pt-4 pb-1">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#787774]">
                Dompet & Rekening ({accounts.length})
              </span>
              <button
                onClick={() => openAccountModal()}
                className="p-0.5 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
                title="Tambah Akun Baru"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-0.5 mt-0.5">
              {accounts.slice(0, 5).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleNavClick('accounts')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-[#37352F]/75 dark:text-[#E6E6E5]/75 hover:bg-[#EAEAEA]/60 dark:hover:bg-[#242424] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: acc.color }}
                    />
                    <span className="truncate text-[11px]">{acc.name}</span>
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-[#787774] dark:text-[#8F8F8F] group-hover:text-[#37352F] dark:group-hover:text-white">
                    {formatCurrency(acc.balance, settings.currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Net Worth & PWA Button */}
        <div className="p-3 border-t border-[#E9E9E7] dark:border-[#262626] space-y-2 bg-[#F7F7F5] dark:bg-[#191919]">
          <div className="px-2 py-1.5 rounded-lg bg-[#EFEFEF] dark:bg-[#222222]">
            <p className="text-[10px] text-[#787774] dark:text-[#8F8F8F]">Total Kekayaan Bersih</p>
            <p className="text-xs font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatCurrency(netWorth, settings.currency)}
            </p>
          </div>

          <PWAInstallButton variant="sidebar" />
        </div>
      </aside>
    </>
  );
};
