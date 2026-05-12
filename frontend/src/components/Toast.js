import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

let toastIdCounter = 0;
const listeners = [];
let toasts = [];

export function addToast(message, type = 'success') {
  const id = ++toastIdCounter;
  toasts = [...toasts, { id, message, type }];
  listeners.forEach(fn => fn([...toasts]));
  setTimeout(() => removeToast(id), 3500);
}

function removeToast(id) {
  toasts = toasts.filter(t => t.id !== id);
  listeners.forEach(fn => fn([...toasts]));
}

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const handleRemove = () => { setExiting(true); setTimeout(onRemove, 250); };
  const icons = {
    success: <CheckCircle size={18}/>,
    error:   <AlertCircle size={18}/>,
    info:    <Info size={18}/>,
  };
  return (
    <div className={`toast toast-${toast.type} ${exiting?'toast-exit':''}`}>
      <span className="toast-icon">{icons[toast.type] || icons.info}</span>
      <span className="toast-text">{toast.message}</span>
      <button className="toast-close" onClick={handleRemove}><X size={14}/></button>
    </div>
  );
}

export default function ToastContainer() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    listeners.push(setItems);
    return () => { const i = listeners.indexOf(setItems); if (i>-1) listeners.splice(i,1); };
  }, []);
  return (
    <div className="toast-container">
      {items.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)}/>
      ))}
    </div>
  );
}
