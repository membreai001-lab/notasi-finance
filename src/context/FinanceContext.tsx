import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Account,
  Transaction,
  Budget,
  SavingsGoal,
  AppSettings,
  Currency,
} from '../types/finance';
import {
  INITIAL_ACCOUNTS,
  getInitialTransactions,
  getInitialBudgets,
  INITIAL_SAVINGS_GOALS,
  INITIAL_SETTINGS,
} from '../utils/seedData';
import { generateId, getCurrentPeriod } from '../utils/formatters';

export type AppView = 'dashboard' | 'transactions' | 'accounts' | 'budgets' | 'analytics' | 'settings';

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  settings: AppSettings;
  activeView: AppView;
  setActiveView: (view: AppView) => void;

  // Modals & UI Controls
  isTransactionModalOpen: boolean;
  setIsTransactionModalOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  openTransactionModal: (tx?: Transaction) => void;
  closeTransactionModal: () => void;

  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  editingAccount: Account | null;
  openAccountModal: (acc?: Account) => void;
  closeAccountModal: () => void;

  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  openTransferModal: (fromAccountId?: string) => void;
  closeTransferModal: () => void;

  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;
  editingBudget: Budget | null;
  openBudgetModal: (budget?: Budget) => void;
  closeBudgetModal: () => void;

  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  editingGoal: SavingsGoal | null;
  openGoalModal: (goal?: SavingsGoal) => void;
  closeGoalModal: () => void;

  isDepositModalOpen: boolean;
  selectedGoalForDeposit: SavingsGoal | null;
  openDepositModal: (goal: SavingsGoal) => void;
  closeDepositModal: () => void;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  batchDeleteTransactions: (ids: string[]) => void;

  addAccount: (acc: Omit<Account, 'id' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  transferBetweenAccounts: (fromId: string, toId: string, amount: number, date: string, note?: string) => void;

  saveBudget: (budget: Omit<Budget, 'id'> & { id?: string }) => void;
  deleteBudget: (id: string) => void;

  saveSavingsGoal: (goal: Omit<SavingsGoal, 'id'> & { id?: string }) => void;
  deleteSavingsGoal: (id: string) => void;
  depositToSavingsGoal: (goalId: string, amount: number, accountId: string) => void;

  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setCurrency: (currency: Currency) => void;

  // Backup & Restore
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;
  clearAllData: () => void;

  // Computations
  netWorth: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthNet: number;
  savingsRate: number;
  categorySpendingCurrentMonth: Record<string, number>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOUNTS: 'notasi_accounts_v1',
  TRANSACTIONS: 'notasi_transactions_v1',
  BUDGETS: 'notasi_budgets_v1',
  SAVINGS_GOALS: 'notasi_savings_goals_v1',
  SETTINGS: 'notasi_settings_v1',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial states with lazy local-storage loading
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : getInitialTransactions();
    } catch {
      return getInitialTransactions();
    }
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return saved ? JSON.parse(saved) : getInitialBudgets();
    } catch {
      return getInitialBudgets();
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [activeView, setActiveView] = useState<AppView>('dashboard');

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFromAccountId, setTransferFromAccountId] = useState<string | undefined>(undefined);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to save budgets to localStorage', e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(savingsGoals));
    } catch (e) {
      console.error('Failed to save savings goals to localStorage', e);
    }
  }, [savingsGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }

    // Apply dark class to documentElement
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings]);

  // Modal Triggers
  const openTransactionModal = (tx?: Transaction) => {
    setEditingTransaction(tx || null);
    setIsTransactionModalOpen(true);
  };
  const closeTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);
  };

  const openAccountModal = (acc?: Account) => {
    setEditingAccount(acc || null);
    setIsAccountModalOpen(true);
  };
  const closeAccountModal = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(false);
  };

  const openTransferModal = (fromAccountId?: string) => {
    setTransferFromAccountId(fromAccountId);
    setIsTransferModalOpen(true);
  };
  const closeTransferModal = () => {
    setTransferFromAccountId(undefined);
    setIsTransferModalOpen(false);
  };

  const openBudgetModal = (budget?: Budget) => {
    setEditingBudget(budget || null);
    setIsBudgetModalOpen(true);
  };
  const closeBudgetModal = () => {
    setEditingBudget(null);
    setIsBudgetModalOpen(false);
  };

  const openGoalModal = (goal?: SavingsGoal) => {
    setEditingGoal(goal || null);
    setIsGoalModalOpen(true);
  };
  const closeGoalModal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(false);
  };

  const openDepositModal = (goal: SavingsGoal) => {
    setSelectedGoalForDeposit(goal);
    setIsDepositModalOpen(true);
  };
  const closeDepositModal = () => {
    setSelectedGoalForDeposit(null);
    setIsDepositModalOpen(false);
  };

  // Transaction Actions
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: generateId('tx'),
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update account balances
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (newTx.type === 'expense' && acc.id === newTx.accountId) {
          return { ...acc, balance: acc.balance - newTx.amount, updatedAt: new Date().toISOString() };
        }
        if (newTx.type === 'income' && acc.id === newTx.accountId) {
          return { ...acc, balance: acc.balance + newTx.amount, updatedAt: new Date().toISOString() };
        }
        if (newTx.type === 'transfer') {
          if (acc.id === newTx.accountId) {
            return { ...acc, balance: acc.balance - newTx.amount, updatedAt: new Date().toISOString() };
          }
          if (acc.id === newTx.toAccountId) {
            return { ...acc, balance: acc.balance + newTx.amount, updatedAt: new Date().toISOString() };
          }
        }
        return acc;
      })
    );
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    // Revert old effect on account balance
    let restoredAccounts = [...accounts];
    const revertOld = (accList: Account[], tx: Transaction): Account[] => {
      return accList.map((acc) => {
        if (tx.type === 'expense' && acc.id === tx.accountId) {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        if (tx.type === 'income' && acc.id === tx.accountId) {
          return { ...acc, balance: acc.balance - tx.amount };
        }
        if (tx.type === 'transfer') {
          if (acc.id === tx.accountId) {
            return { ...acc, balance: acc.balance + tx.amount };
          }
          if (acc.id === tx.toAccountId) {
            return { ...acc, balance: acc.balance - tx.amount };
          }
        }
        return acc;
      });
    };

    restoredAccounts = revertOld(restoredAccounts, existing);

    const updatedTx: Transaction = { ...existing, ...updates };

    // Apply new effect on balance
    const updatedAccounts = restoredAccounts.map((acc) => {
      if (updatedTx.type === 'expense' && acc.id === updatedTx.accountId) {
        return { ...acc, balance: acc.balance - updatedTx.amount, updatedAt: new Date().toISOString() };
      }
      if (updatedTx.type === 'income' && acc.id === updatedTx.accountId) {
        return { ...acc, balance: acc.balance + updatedTx.amount, updatedAt: new Date().toISOString() };
      }
      if (updatedTx.type === 'transfer') {
        if (acc.id === updatedTx.accountId) {
          return { ...acc, balance: acc.balance - updatedTx.amount, updatedAt: new Date().toISOString() };
        }
        if (acc.id === updatedTx.toAccountId) {
          return { ...acc, balance: acc.balance + updatedTx.amount, updatedAt: new Date().toISOString() };
        }
      }
      return acc;
    });

    setAccounts(updatedAccounts);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTx : t)));
  };

  const deleteTransaction = (id: string) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    // Revert account balance
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (existing.type === 'expense' && acc.id === existing.accountId) {
          return { ...acc, balance: acc.balance + existing.amount, updatedAt: new Date().toISOString() };
        }
        if (existing.type === 'income' && acc.id === existing.accountId) {
          return { ...acc, balance: acc.balance - existing.amount, updatedAt: new Date().toISOString() };
        }
        if (existing.type === 'transfer') {
          if (acc.id === existing.accountId) {
            return { ...acc, balance: acc.balance + existing.amount, updatedAt: new Date().toISOString() };
          }
          if (acc.id === existing.toAccountId) {
            return { ...acc, balance: acc.balance - existing.amount, updatedAt: new Date().toISOString() };
          }
        }
        return acc;
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const batchDeleteTransactions = (ids: string[]) => {
    ids.forEach((id) => deleteTransaction(id));
  };

  // Account Actions
  const addAccount = (accData: Omit<Account, 'id' | 'updatedAt'>) => {
    const newAcc: Account = {
      ...accData,
      id: generateId('acc'),
      updatedAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates, updatedAt: new Date().toISOString() } : acc))
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const transferBetweenAccounts = (fromId: string, toId: string, amount: number, date: string, note?: string) => {
    if (fromId === toId || amount <= 0) return;

    addTransaction({
      type: 'transfer',
      amount,
      currency: settings.currency,
      accountId: fromId,
      toAccountId: toId,
      category: 'Transfer Antar Dompet',
      date,
      note: note || 'Transfer Antar Dompet',
      tags: ['transfer'],
    });
  };

  // Budget Actions
  const saveBudget = (budgetData: Omit<Budget, 'id'> & { id?: string }) => {
    if (budgetData.id) {
      setBudgets((prev) =>
        prev.map((b) => (b.id === budgetData.id ? ({ ...b, ...budgetData } as Budget) : b))
      );
    } else {
      const newBudget: Budget = {
        ...budgetData,
        id: generateId('bg'),
      };
      setBudgets((prev) => [...prev, newBudget]);
    }
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Savings Goal Actions
  const saveSavingsGoal = (goalData: Omit<SavingsGoal, 'id'> & { id?: string }) => {
    if (goalData.id) {
      setSavingsGoals((prev) =>
        prev.map((g) => (g.id === goalData.id ? ({ ...g, ...goalData } as SavingsGoal) : g))
      );
    } else {
      const newGoal: SavingsGoal = {
        ...goalData,
        id: generateId('goal'),
        isCompleted: false,
      };
      setSavingsGoals((prev) => [...prev, newGoal]);
    }
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const depositToSavingsGoal = (goalId: string, amount: number, accountId: string) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal || amount <= 0) return;

    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;

    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: newAmount, isCompleted } : g))
    );

    // Record as transfer / expense from account
    addTransaction({
      type: 'expense',
      amount,
      currency: settings.currency,
      accountId,
      category: 'Investasi & Dividen',
      date: new Date().toISOString().split('T')[0],
      note: `Setoran Tabungan: ${goal.title}`,
      tags: ['tabungan', goal.title.toLowerCase().replace(/\s+/g, '-')],
    });
  };

  // Settings Actions
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const setCurrency = (currency: Currency) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  // Backup & Restore
  const exportBackupJSON = () => {
    const backupPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'Notasi Finance',
      data: {
        accounts,
        transactions,
        budgets,
        savingsGoals,
        settings,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `notasi-finance-backup-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    updateSettings({ lastBackupAt: new Date().toISOString() });
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.data) {
        throw new Error('Invalid format: missing data container');
      }

      const { data } = parsed;
      if (Array.isArray(data.accounts)) setAccounts(data.accounts);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.budgets)) setBudgets(data.budgets);
      if (Array.isArray(data.savingsGoals)) setSavingsGoals(data.savingsGoals);
      if (data.settings && typeof data.settings === 'object') {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }

      return true;
    } catch (err) {
      console.error('Backup import error:', err);
      return false;
    }
  };

  const resetToSampleData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(getInitialTransactions());
    setBudgets(getInitialBudgets());
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setSettings(INITIAL_SETTINGS);
  };

  const clearAllData = () => {
    setAccounts([]);
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
  };

  // Computed Financial Metrics
  const netWorth = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.balance, 0);
  }, [accounts]);

  const currentPeriod = getCurrentPeriod();

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(currentPeriod));
  }, [transactions, currentPeriod]);

  const currentMonthIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const currentMonthExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const currentMonthNet = currentMonthIncome - currentMonthExpense;

  const savingsRate = useMemo(() => {
    if (currentMonthIncome <= 0) return 0;
    const rate = ((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100;
    return Math.max(0, Math.min(100, Math.round(rate)));
  }, [currentMonthIncome, currentMonthExpense]);

  const categorySpendingCurrentMonth = useMemo(() => {
    const map: Record<string, number> = {};
    currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [currentMonthTransactions]);

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        budgets,
        savingsGoals,
        settings,
        activeView,
        setActiveView,

        isTransactionModalOpen,
        setIsTransactionModalOpen,
        editingTransaction,
        openTransactionModal,
        closeTransactionModal,

        isAccountModalOpen,
        setIsAccountModalOpen,
        editingAccount,
        openAccountModal,
        closeAccountModal,

        isTransferModalOpen,
        setIsTransferModalOpen,
        openTransferModal,
        closeTransferModal,

        isBudgetModalOpen,
        setIsBudgetModalOpen,
        editingBudget,
        openBudgetModal,
        closeBudgetModal,

        isGoalModalOpen,
        setIsGoalModalOpen,
        editingGoal,
        openGoalModal,
        closeGoalModal,

        isDepositModalOpen,
        selectedGoalForDeposit,
        openDepositModal,
        closeDepositModal,

        addTransaction,
        updateTransaction,
        deleteTransaction,
        batchDeleteTransactions,

        addAccount,
        updateAccount,
        deleteAccount,
        transferBetweenAccounts,

        saveBudget,
        deleteBudget,

        saveSavingsGoal,
        deleteSavingsGoal,
        depositToSavingsGoal,

        updateSettings,
        toggleTheme,
        setCurrency,

        exportBackupJSON,
        importBackupJSON,
        resetToSampleData,
        clearAllData,

        netWorth,
        currentMonthIncome,
        currentMonthExpense,
        currentMonthNet,
        savingsRate,
        categorySpendingCurrentMonth,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
