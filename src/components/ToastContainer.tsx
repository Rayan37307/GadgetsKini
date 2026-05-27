/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
  onDismiss: (id: string) => void;
  key?: React.Key;
}

function ToastItem({ id, message, type, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const icons = {
    success: <CheckCircle className="text-emerald-400 shrink-0" size={16} />,
    warning: <AlertTriangle className="text-amber-400 shrink-0" size={16} />,
    error: <XCircle className="text-rose-500 shrink-0" size={16} />,
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-slate-900/95 shadow-emerald-500/5',
    warning: 'border-amber-500/30 bg-slate-900/95 shadow-amber-500/5',
    error: 'border-rose-500/30 bg-slate-900/95 shadow-rose-500/5',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      className={`border p-4 rounded-xl shadow-2xl flex items-center justify-between gap-3 w-80 md:w-96 backdrop-blur-md z-[9999] ${borderColors[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-slate-100 text-xs font-semibold leading-relaxed">
          {message}
        </p>
      </div>
      <button 
        onClick={() => onDismiss(id)}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss toast notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div id="toast-root-overlay" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastItem 
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onDismiss={dismissToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
