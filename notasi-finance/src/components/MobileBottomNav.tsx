import React from 'react';
import { useFinance, AppView } from '../context/FinanceContext';
import { LayoutDashboard, TableProperties, Wallet, PiggyBank, Plus } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, openTransactionModal } = useFinance();

  const tabs: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Ikhtisar', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Catatan', icon: <TableProperties className="w-5 h-5" /> },
    { id: 'accounts', label: 'Dompet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'budgets', label: 'Anggaran', icon: <PiggyBank className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#FFFFFF]/95 dark:bg-[#1C1C1C]/95 backdrop-blur-md border-t border-[#E9E9E7] dark:border-[#2C2C2C] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-center h-14 px-1 max-w-lg mx-auto">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors ${
            activeView === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">Ikhtisar</span>
        </button>

        {/* Tab 2: Transactions */}
        <button
          onClick={() => setActiveView('transactions')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors ${
            activeView === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          <TableProperties className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">Catatan</span>
        </button>

        {/* Center Quick Entry Trigger */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => openTransactionModal()}
            className="w-10 h-10 -mt-2 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 active:scale-95 transition-transform"
            aria-label="Catat Transaksi Cepat"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Wallets */}
        <button
          onClick={() => setActiveView('accounts')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors ${
            activeView === 'accounts'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">Dompet</span>
        </button>

        {/* Tab 4: Budgets */}
        <button
          onClick={() => setActiveView('budgets')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors ${
            activeView === 'budgets'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">Target</span>
        </button>
      </div>
    </nav>
  );
};
