import { useEffect, useState } from 'react';
import { X, Plus, Pencil, AlertCircle, Package, Tag, Home, Phone, CheckSquare, User } from 'lucide-react';

const CATEGORIES = ['Kitchen', 'Study', 'Leisure', 'Tools', 'Other', 'Electronics', 'Furniture', 'Stationery', 'Books', 'Clothing', 'Sports'];

const EMPTY_FORM = { itemName: '', category: '', ownerName: '', boardingAddress: '', contact: '', availability: 'Available' };

export default function ItemModal({ onClose, onSave, editItem, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(editItem);

  useEffect(() => {
    setForm(editItem
      ? { 
          itemName: editItem.itemName || '', 
          category: editItem.category || '', 
          ownerName: editItem.ownerName || '', 
          boardingAddress: editItem.boardingAddress || '', 
          contact: editItem.contact || '', 
          availability: editItem.availability || 'Available' 
        }
      : EMPTY_FORM);
    setErrors({});
  }, [editItem]);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.itemName.trim()) e.itemName = 'Item name is required.';
    if (!form.ownerName.trim()) e.ownerName = 'Owner name is required.';
    if (!form.boardingAddress.trim()) e.boardingAddress = 'Boarding address is required.';
    if (!form.contact.trim()) e.contact = 'Contact is required.';
    else if (!/^[\d\s+\-()]{6,15}$/.test(form.contact.trim())) e.contact = 'Enter a valid contact number.';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-icon">
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <div className="modal-title">{isEdit ? 'Edit Item' : 'Add New Item'}</div>
              <div className="modal-subtitle">{isEdit ? 'Update details and save.' : 'Fill in details to share an item.'}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">

              {/* Item Name */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="itemName">
                  <Package size={13} /> Item Name <span className="required">*</span>
                </label>
                <input id="itemName" name="itemName" type="text"
                  className={`form-input ${errors.itemName ? 'error' : ''}`}
                  placeholder="e.g. Electric Kettle"
                  value={form.itemName} onChange={handleChange} autoFocus />
                {errors.itemName && <span className="error-msg"><AlertCircle size={13} />{errors.itemName}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category"><Tag size={13} /> Category</label>
                <select id="category" name="category" className="form-select" value={form.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Availability */}
              <div className="form-group">
                <label className="form-label" htmlFor="availability"><CheckSquare size={13} /> Availability</label>
                <select id="availability" name="availability" className="form-select" value={form.availability} onChange={handleChange}>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              {/* Owner Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="ownerName"><User size={13} /> Owner Name <span className="required">*</span></label>
                <input id="ownerName" name="ownerName" type="text" className={`form-input ${errors.ownerName ? 'error' : ''}`}
                  placeholder="e.g. John Doe"
                  value={form.ownerName} onChange={handleChange} />
                {errors.ownerName && <span className="error-msg"><AlertCircle size={13} />{errors.ownerName}</span>}
              </div>

              {/* Boarding Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="boardingAddress"><Home size={13} /> Boarding Address <span className="required">*</span></label>
                <input id="boardingAddress" name="boardingAddress" type="text" className={`form-input ${errors.boardingAddress ? 'error' : ''}`}
                  placeholder="e.g. 123 Main St"
                  value={form.boardingAddress} onChange={handleChange} />
                {errors.boardingAddress && <span className="error-msg"><AlertCircle size={13} />{errors.boardingAddress}</span>}
              </div>

              {/* Contact */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="contact">
                  <Phone size={13} /> Contact <span className="required">*</span>
                </label>
                <input id="contact" name="contact" type="tel"
                  className={`form-input ${errors.contact ? 'error' : ''}`}
                  placeholder="e.g. 0771234567"
                  value={form.contact} onChange={handleChange} />
                {errors.contact && <span className="error-msg"><AlertCircle size={13} />{errors.contact}</span>}
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner-sm" /> Saving…</>
                : <>{isEdit ? <Pencil size={16} /> : <Plus size={16} />}{isEdit ? 'Save Changes' : 'Add Item'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
