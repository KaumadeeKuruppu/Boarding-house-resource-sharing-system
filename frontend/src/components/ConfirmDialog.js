import { Trash2, X, RefreshCw } from 'lucide-react';

export default function ConfirmDialog({
  title        = 'Are you sure?',
  message      = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  confirmClass = 'btn-danger',
  isDanger     = true,
  loading,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>

        <div className={`confirm-icon ${isDanger ? 'confirm-icon-danger' : 'confirm-icon-accent'}`}>
          {isDanger ? <Trash2 size={26} /> : <RefreshCw size={26} />}
        </div>

        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="btn btn-outline" onClick={onCancel} disabled={loading}>
            <X size={16} /> Cancel
          </button>
          <button className={confirmClass} onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="spinner-sm" /> Processing…
              </span>
            ) : (
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                {isDanger ? <Trash2 size={15} /> : <RefreshCw size={15} />}
                {confirmLabel}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
