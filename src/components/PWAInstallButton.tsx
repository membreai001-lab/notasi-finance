import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running in PWA standalone window, do not render
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General prompt or modal explaining install
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'sidebar' ? (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#37352F]/80 dark:text-[#E6E6E5]/80 hover:bg-[#EAEAEA] dark:hover:bg-[#2F2F2F] rounded-md transition-colors"
        >
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">Pasang Aplikasi (PWA)</span>
        </button>
      ) : variant === 'banner' ? (
        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                Akses Cepat di Android & iOS
              </p>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9B9B]">
                Gunakan offline tanpa install dari store
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 text-xs font-medium bg-[#191919] text-white dark:bg-white dark:text-[#191919] rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Pasang Sekarang
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-[#E9E9E7] dark:border-[#303030] text-[#37352F] dark:text-[#E6E6E5] hover:bg-[#EAEAEA] dark:hover:bg-[#262626] transition-colors whitespace-nowrap"
          title="Pasang Notasi Finance di perangkat Anda"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Pasang PWA</span>
        </button>
      )}

      {/* Guide Modal for iOS / Browser Instructions */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#303030] rounded-xl p-5 shadow-2xl relative text-left">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-[#787774] hover:text-[#37352F] dark:text-[#9B9B9B] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                  Pasang di Perangkat
                </h3>
                <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
                  Bekerja di iOS (iPhone/iPad) & Android
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#37352F] dark:text-[#D4D4D4] mb-5">
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#282828] rounded-lg space-y-2">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Untuk Pengguna iPhone / iPad (Safari):
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[#787774] dark:text-[#A3A3A3]">
                  <li>
                    Tekan tombol <strong className="text-[#37352F] dark:text-white">Bagikan (Share)</strong> di bilah bawah Safari.
                  </li>
                  <li>
                    Gulir ke bawah dan pilih <strong className="text-[#37352F] dark:text-white">Tambah ke Layar Utama (Add to Home Screen)</strong>.
                  </li>
                  <li>Buka Notasi dari layar utama untuk pengalaman aplikasi native penuh.</li>
                </ol>
              </div>

              <div className="p-3 bg-[#F7F7F5] dark:bg-[#282828] rounded-lg space-y-2">
                <p className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <PlusSquare className="w-3.5 h-3.5" /> Untuk Android (Chrome) & Desktop:
                </p>
                <p className="text-[#787774] dark:text-[#A3A3A3]">
                  Tekan menu titik tiga ⋮ di peramban, lalu pilih <strong>&quot;Instal aplikasi&quot;</strong> atau <strong>&quot;Tambahkan ke Layar Utama&quot;</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 text-xs font-medium bg-[#191919] text-white dark:bg-white dark:text-[#191919] rounded-lg hover:opacity-90 transition-opacity"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
