import React, { useState, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Currency, CURRENCY_CONFIGS } from '../../types/finance';
import { PWAInstallButton } from '../PWAInstallButton';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  Moon,
  Sun,
  Globe,
  Smartphone,
  ShieldCheck,
  Copy,
  Key,
} from 'lucide-react';

export const SettingsSyncView: React.FC = () => {
  const {
    settings,
    updateSettings,
    setCurrency,
    toggleTheme,
    exportBackupJSON,
    importBackupJSON,
    resetToSampleData,
    clearAllData,
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedSyncCode, setCopiedSyncCode] = useState(false);
  const [customSyncKey, setCustomSyncKey] = useState(settings.syncCode || '');

  const currencies: Currency[] = ['IDR', 'USD', 'EUR', 'SGD', 'JPY', 'GBP'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        setImportStatus('Data berhasil dipulihkan dari berkas cadangan!');
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus('Format berkas tidak valid atau rusak.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopySyncKey = () => {
    const syncCode = settings.syncCode || `NOTASI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    if (!settings.syncCode) {
      updateSettings({ syncCode });
    }
    navigator.clipboard.writeText(syncCode);
    setCopiedSyncCode(true);
    setTimeout(() => setCopiedSyncCode(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* View Header */}
      <div className="border-b border-[#E9E9E7] dark:border-[#262626] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352F] dark:text-white">
          Pengaturan & Sinkronisasi
        </h1>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Atur preferensi mata uang, tema, dan pencadangan data antar perangkat
        </p>
      </div>

      {importStatus && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            importStatus.includes('berhasil')
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* SECTION 1: MATA UANG & FORMAT */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-[#37352F] dark:text-white">
            Format Mata Uang Utama
          </h2>
        </div>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Pilih mata uang yang digunakan untuk menampilkan seluruh laporan dan ringkasan.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currencies.map((curr) => {
            const config = CURRENCY_CONFIGS[curr];
            const isSelected = settings.currency === curr;

            return (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 text-[#37352F] dark:text-white font-semibold'
                    : 'border-[#E9E9E7] dark:border-[#303030] text-[#787774] dark:text-[#9B9B9B] hover:bg-[#F7F7F5] dark:hover:bg-[#252525]'
                }`}
              >
                <div>
                  <p className="text-xs font-mono font-bold">{config.symbol}</p>
                  <p className="text-[11px] truncate">{config.code}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: TEMA & TAMPILAN */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-[#37352F] dark:text-white">
            Tema Tampilan (Mode Gelap Elegan)
          </h2>
        </div>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Ganti palet warna sesuai kenyamanan mata Anda. Mode gelap menggunakan palet Slate murni ala Notion.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium transition-colors ${
              settings.theme === 'dark'
                ? 'border-emerald-500 bg-[#191919] text-white shadow-xs'
                : 'border-[#E9E9E7] dark:border-[#303030] text-[#787774] hover:bg-[#F7F7F5] dark:hover:bg-[#252525]'
            }`}
          >
            <Moon className="w-4 h-4 text-emerald-400" />
            <span>Notion Dark Slate</span>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium transition-colors ${
              settings.theme === 'light'
                ? 'border-emerald-500 bg-white text-[#37352F] shadow-xs font-semibold'
                : 'border-[#E9E9E7] dark:border-[#303030] text-[#787774] hover:bg-[#F7F7F5] dark:hover:bg-[#252525]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Notion Light Clean</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: SINKRONISASI & CADANGAN (BACKUP & RESTORE) */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-[#37352F] dark:text-white">
            Sinkronisasi & Cadangan Antar Perangkat
          </h2>
        </div>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Simpan seluruh basis data keuangan Anda ke dalam berkas JSON terenkripsi atau pulihkan di perangkat lain (laptop, smartphone Android, atau iPhone) tanpa bergantung pada cloud publik.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={exportBackupJSON}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#191919] text-white dark:bg-white dark:text-[#191919] text-xs font-medium hover:opacity-90 transition-opacity shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan (JSON Backup)</span>
          </button>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[#E9E9E7] dark:border-[#303030] text-xs font-medium text-[#37352F] dark:text-white hover:bg-[#F7F7F5] dark:hover:bg-[#252525] transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pulihkan dari Berkas Cadangan</span>
            </button>
          </div>
        </div>

        {/* Cloud Sync Key Card */}
        <div className="p-3.5 rounded-lg bg-[#F9F9F8] dark:bg-[#1A1A1A] border border-[#E9E9E7] dark:border-[#2A2A2A] space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#37352F] dark:text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-500" /> Kunci Sinkronisasi Perangkat
            </span>
            <button
              onClick={handleCopySyncKey}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copiedSyncCode ? 'Tersalin!' : 'Salin Kode'}
            </button>
          </div>
          <p className="text-[11px] text-[#787774] dark:text-[#888888]">
            Gunakan kode ini untuk menyamakan data catatan keuangan secara instan saat menghubungkan perangkat kedua.
          </p>
          <div className="font-mono text-xs p-2 bg-white dark:bg-[#222222] border border-[#E9E9E7] dark:border-[#303030] rounded select-all text-[#37352F] dark:text-white">
            {settings.syncCode || 'NOTASI-SYNC-VAULT-2026'}
          </div>
        </div>
      </div>

      {/* SECTION 4: PASANG APLIKASI (PWA) */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-[#37352F] dark:text-white">
            Ketersediaan Android, iOS, & Web
          </h2>
        </div>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Aplikasi ini dirancang sebagai Progressive Web App (PWA) dengan viewport adaptif, offline caching, dan pengalaman layar penuh tanpa bilah peramban.
        </p>

        <PWAInstallButton variant="banner" />
      </div>

      {/* SECTION 5: MANAJEMEN DATA & RESET */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2C2C2C] shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-[#37352F] dark:text-white">
          Reset & Contoh Data
        </h2>
        <p className="text-xs text-[#787774] dark:text-[#888888]">
          Ingin mencoba alur kerja dari awal atau memulihkan data percontohan?
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Muat ulang data percontohan (sample ledger)? Transaksi yang belum dicadangkan akan tertimpa.')) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E9E9E7] dark:border-[#303030] text-[#37352F] dark:text-white hover:bg-[#F7F7F5] dark:hover:bg-[#252525] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
            <span>Muat Data Contoh</span>
          </button>

          <button
            onClick={() => {
              if (confirm('PERINGATAN: Kosongkan seluruh transaksi dan rekening? Tindakan ini tidak dapat dibatalkan jika belum dicadangkan.')) {
                clearAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Semua Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
