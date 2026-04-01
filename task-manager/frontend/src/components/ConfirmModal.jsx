import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="scale-in bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/30 w-full max-w-sm border border-slate-100 dark:border-slate-800 overflow-hidden">

        {/* Body */}
        <div className="px-6 pt-7 pb-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 ring-4 ring-red-50 dark:ring-red-500/5">
            <AlertTriangle size={22} className="text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-sm shadow-red-200 dark:shadow-red-900/30 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
