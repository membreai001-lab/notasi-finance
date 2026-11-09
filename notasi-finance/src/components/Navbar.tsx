import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Menu, Plus, RefreshCw, Sun, Moon, Database } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    activeView,
    setActiveView,
    openTransactionModal,
    toggleTheme,
    settings,
  } = useFinance();

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Ikhtisar Keuangan';
      case 'transactions':
        return 'Database Transaksi';
      case 'accounts':
        return 'Dompet & Rekening';
      case 'budgets':
        return 'Anggaran & Target';
      case 'analytics':
        return 'Analisis Arus Kas';
      case 'settings':
        return 'Pengaturan & Cadangan';
      default:
        return 'Keuangan';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#F7F7F5]/90 dark:bg-[#191919]/90 backdrop-blur-md border-b border-[#E9E9E7] dark:border-[#262626] flex items-center justify-between px-4 gap-4">
      {/* Zone 1: Sidebar Toggle & Contextual Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1 rounded-md text-[#787774] hover:text-[#37352F] hover:bg-[#EAEAEA] dark:text-[#9B9B9B] dark:hover:text-[#E6E6E5] dark:hover:bg-[#2F2F2F] transition-colors md:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#888888] truncate">
          <span className="hidden sm:inline font-medium hover:text-[#37352F] dark:hover:text-white transition-colors cursor-pointer" onClick={() => setActiveView('dashboard')}>
            Notasi
          </span>
          <span className="hidden sm:inline" aria-hidden="true">/</span>
          <h2 className="font-semibold text-[#37352F] dark:text-[#E6E6E5] truncate">
            {getViewTitle()}
          </h2>
        </div>
      </div>

      {/* Zone 2: Fast Quick Tabs (Desktop Viewport) */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#EFEFEF] dark:bg-[#242424] p-1 rounded-lg">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'dashboard'
              ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
              : 'text-[#787774] dark:text-[#A3A3A3] hover:text-[#37352F] dark:hover:text-white'
          }`}
        >
          Ikhtisar
        </button>
        <button
          onClick={() => setActiveView('transactions')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'transactions'
              ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
              : 'text-[#787774] dark:text-[#A3A3A3] hover:text-[#37352F] dark:hover:text-white'
          }`}
        >
          Transaksi
        </button>
        <button
          onClick={() => setActiveView('accounts')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'accounts'
              ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
              : 'text-[#787774] dark:text-[#A3A3A3] hover:text-[#37352F] dark:hover:text-white'
          }`}
        >
          Dompet
        </button>
        <button
          onClick={() => setActiveView('budgets')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'budgets'
              ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
              : 'text-[#787774] dark:text-[#A3A3A3] hover:text-[#37352F] dark:hover:text-white'
          }`}
        >
          Anggaran & Target
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'analytics'
              ? 'bg-white dark:bg-[#333333] text-[#37352F] dark:text-white shadow-xs'
              : 'text-[#787774] dark:text-[#A3A3A3] hover:text-[#37352F] dark:hover:text-white'
          }`}
        >
          Analisis
        </button>
      </nav>

      {/* Zone 3: Primary Action & Install Affordance */}
      <div className="flex items-center gap-2 shrink-0">
        <PWAInstallButton variant="nav" />

        <button
          onClick={() => toggleTheme()}
          className="p-1.5 rounded-md text-[#787774] hover:text-[#37352F] hover:bg-[#EAEAEA] dark:text-[#9B9B9B] dark:hover:text-white dark:hover:bg-[#2B2B2B] transition-colors hidden sm:flex"
          title="Ganti Tema"
          aria-label="Ganti Tema"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => openTransactionModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#191919] text-white hover:bg-[#2F2F2F] dark:bg-white dark:text-[#191919] dark:hover:bg-[#EAEAEA] rounded-md transition-colors shadow-xs whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Catat Transaksi</span>
          <span className="sm:hidden">Catat</span>
        </button>
      </div>
    </header>
  );
};
