import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert, Loader2 } from 'lucide-react';
import { CaseItem } from '../types';

interface DeleteCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem | null;
  onConfirmDelete: (caseId: string) => Promise<void>;
}

export const DeleteCaseModal: React.FC<DeleteCaseModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  onConfirmDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !caseItem) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirmDelete(caseItem.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete case.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-red-500/40 p-6 space-y-5 shadow-2xl shadow-red-950/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Delete Investigation
              </h3>
              <p className="text-xs font-mono text-red-400">
                {caseItem.case_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p className="font-semibold text-white">
            {caseItem.title}
          </p>
          <p className="leading-relaxed text-slate-400">
            Are you sure you want to permanently delete this forensic investigation? This action cannot be undone and will cascade to all associated records:
          </p>
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20 font-mono text-[11px] text-red-300 space-y-1">
            <div>• Evidence files and raw telemetry</div>
            <div>• Reconstructed chronological timeline events</div>
            <div>• Cross-modal contradiction matrix records</div>
            <div>• 2D kinematic trajectory simulations</div>
            <div>• Generated forensic investigation reports</div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs font-mono flex items-center space-x-2 shadow-lg shadow-red-900/40 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting Data...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
