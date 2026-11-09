import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Target, Shield, Laptop, Plane, Home, Car, Heart } from 'lucide-react';

const ICON_OPTIONS = [
  { id: 'Shield', label: 'Keamanan / Darurat', icon: <Shield className="w-4 h-4" /> },
  { id: 'Laptop', label: 'Gadget / Kerja', icon: <Laptop className="w-4 h-4" /> },
  { id: 'Plane', label: 'Liburan / Wisata', icon: <Plane className="w-4 h-4" /> },
  { id: 'Home', label: 'Rumah / Hunian', icon: <Home className="w-4 h-4" /> },
  { id: 'Car', label: 'Kendaraan', icon: <Car className="w-4 h-4" /> },
  { id: 'Heart', label: 'Pernikahan / Keluarga', icon: <Heart className="w-4 h-4" /> },
];

const COLOR_OPTIONS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export const GoalModal: React.FC = () => {
  const {
    isGoalModalOpen,
    closeGoalModal,
    editingGoal,
    saveSavingsGoal,
    settings,
  } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Keamanan Finansial');
  const [icon, setIcon] = useState('Shield');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setTargetAmount(String(editingGoal.targetAmount));
      setCurrentAmount(String(editingGoal.currentAmount));
      setTargetDate(editingGoal.targetDate);
      setCategory(editingGoal.category);
      setIcon(editingGoal.icon);
      setColor(editingGoal.color);
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      // Default 1 year from now
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setTargetDate(nextYear.toISOString().split('T')[0]);
      setCategory('Keamanan Finansial');
      setIcon('Shield');
      setColor(COLOR_OPTIONS[0]);
    }
  }, [editingGoal, isGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;
    if (!title.trim() || isNaN(target) || target <= 0) return;

    saveSavingsGoal({
      id: editingGoal?.id,
      title: title.trim(),
      targetAmount: target,
      currentAmount: current,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      category,
      icon,
      color,
      isCompleted: current >= target,
    });

    closeGoalModal();
  };

  const parsedTarget = parseFloat(targetAmount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#303030] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-[#E9E9E7] dark:border-[#2C2C2C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
              {editingGoal ? 'Ubah Target Tabungan' : 'Buat Target Impian Baru'}
            </span>
          </div>
          <button
            onClick={closeGoalModal}
            className="p-1 rounded text-[#787774] hover:text-[#37352F] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Nama Impian / Tabungan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Dana Darurat, MacBook Baru, Trip Jepang..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                Target Nominal ({settings.currency})
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-mono font-bold tabular-nums rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
                Terkumpul Saat Ini
              </label>
              <input
                type="number"
                step="any"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          {parsedTarget > 0 && (
            <p className="text-xs font-mono text-[#787774] dark:text-[#888888] -mt-2">
              Target: {formatCurrency(parsedTarget, settings.currency)}
            </p>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1">
              Target Waktu Pencapaian
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9E9E7] dark:border-[#383838] bg-white dark:bg-[#191919] text-[#37352F] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1.5">
              Ikon Impian
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ICON_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIcon(item.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                    icon === item.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-[#E9E9E7] dark:border-[#303030] text-[#787774] dark:text-[#9B9B9B] hover:bg-[#F7F7F5] dark:hover:bg-[#252525]'
                  }`}
                >
                  {item.icon}
                  <span className="truncate text-[11px]">{item.label.split('/')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B] mb-1.5">
              Warna Tema
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
              onClick={closeGoalModal}
              className="px-4 py-2 text-xs font-medium rounded-lg text-[#787774] hover:text-[#37352F] dark:text-[#9B9B9B] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#191919] text-white hover:bg-[#2F2F2F] dark:bg-white dark:text-[#191919] dark:hover:bg-[#EAEAEA] transition-colors shadow-xs"
            >
              Simpan Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
