/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';

// Feature Views
import { DashboardView } from './components/views/DashboardView';
import { TransactionsDatabaseView } from './components/views/TransactionsDatabaseView';
import { AccountsView } from './components/views/AccountsView';
import { BudgetsGoalsView } from './components/views/BudgetsGoalsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsSyncView } from './components/views/SettingsSyncView';

// Modals
import { TransactionModal } from './components/modals/TransactionModal';
import { AccountModal } from './components/modals/AccountModal';
import { TransferModal } from './components/modals/TransferModal';
import { BudgetModal } from './components/modals/BudgetModal';
import { GoalModal } from './components/modals/GoalModal';
import { DepositModal } from './components/modals/DepositModal';

const MainContent: React.FC = () => {
  const { activeView } = useFinance();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsDatabaseView />;
      case 'accounts':
        return <AccountsView />;
      case 'budgets':
        return <BudgetsGoalsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsSyncView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-[#E6E6E5] font-sans">
      {/* Notion Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Scrollable Workspace Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Mobile Ergonomic Bottom Tab Bar */}
        <MobileBottomNav />

        {/* Status and Connectivity Indicators */}
        <OfflineIndicator />
      </div>

      {/* Global Modals */}
      <TransactionModal />
      <AccountModal />
      <TransferModal />
      <BudgetModal />
      <GoalModal />
      <DepositModal />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
