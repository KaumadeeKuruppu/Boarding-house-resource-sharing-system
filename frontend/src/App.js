import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Plus, Search, X, Package, RefreshCw,
  Share2, LayoutGrid, AlertTriangle, Lock, LogOut, Eye, EyeOff
} from 'lucide-react';

import './App.css';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import ConfirmDialog from './components/ConfirmDialog';
import ToastContainer, { addToast } from './components/Toast';

const API = 'http://localhost:8000/api/item';
const ADMIN_PASSWORD = 'admin123';

const CATEGORIES = ['All', 'Kitchen', 'Study', 'Leisure', 'Tools', 'Electronics', 'Furniture', 'Stationery', 'Books', 'Clothing', 'Sports', 'Other'];
const STATUS_FILTERS = ['All', 'Available', 'Not Available'];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-header" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  );
}

/* ══════════════════════════════════════════
   LOGIN PAGE COMPONENT
══════════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg-orb orb-1" />
      <div className="login-bg-orb orb-2" />
      <div className="login-bg-orb orb-3" />

      <div className={`login-card ${shaking ? 'shake' : ''}`}>
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <Share2 size={28} />
          </div>
          <h1>Boarding <span>Resource</span> Sharing</h1>
          <p>Admin Portal — Please sign in to continue</p>
        </div>

        {/* Divider */}
        <div className="login-divider" />

        {/* Lock icon */}
        <div className="login-lock-icon">
          <Lock size={20} />
        </div>
        <p className="login-lock-label">Admin Access</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="admin-password" className="login-label">Admin Password</label>
            <div className="login-input-wrap">
              <Lock size={15} className="login-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className={`login-input ${error ? 'login-input-error' : ''}`}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-toggle-vis"
                onClick={() => setShowPassword(v => !v)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className="login-error-msg">{error}</p>}
          </div>

          <button id="login-submit-btn" type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <p className="login-footer-note">
          🔒 This portal is restricted to authorised administrators only.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
export default function App() {
  /* ── Auth ── */
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('brs_admin_logged_in') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem('brs_admin_logged_in', 'true');
    setIsLoggedIn(true);
    addToast('Welcome back, Admin! 👋', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('brs_admin_logged_in');
    setIsLoggedIn(false);
    addToast('Logged out successfully.', 'info');
  };

  /* ── Data ── */
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);

  /* ── Fetch ── */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/getall`);
      const data = Array.isArray(res.data) ? res.data : res.data.items || [];
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load items. Is the server running?', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchItems();
  }, [fetchItems, isLoggedIn]);

  /* ── Filter ── */
  const filtered = items.filter(item => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      item.itemName?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.ownerName?.toLowerCase().includes(q) ||
      item.boardingAddress?.toLowerCase().includes(q);

    const matchCat = catFilter === 'All' ||
      item.category?.toLowerCase() === catFilter.toLowerCase();

    const matchStatus = statusFilter === 'All' ||
      (statusFilter === 'Available' && item.availability === 'Available') ||
      (statusFilter === 'Not Available' && item.availability === 'Not Available');

    return matchSearch && matchCat && matchStatus;
  });

  const notFound = search.trim() !== '' && filtered.length === 0 && !loading;

  /* ── Save ── */
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editItem) {
        await axios.put(`${API}/update/${editItem._id}`, formData);
        addToast(`"${formData.itemName}" updated successfully!`, 'success');
      } else {
        await axios.post(`${API}/create`, formData);
        addToast(`"${formData.itemName}" added successfully!`, 'success');
      }
      setShowModal(false); setEditItem(null);
      await fetchItems();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally { setSaving(false); }
  };

  /* ── Delete ── */
  const handleDeleteConfirm = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/delete/${confirmTarget._id}`);
      addToast(`"${confirmTarget.itemName}" deleted.`, 'info');
      setConfirmTarget(null);
      await fetchItems();
    } catch (err) {
      console.error(err);
      addToast('Delete failed. Please try again.', 'error');
    } finally { setDeleting(false); }
  };

  /* ── Toggle Availability ── */
  const handleToggleConfirm = async () => {
    if (!toggleTarget) return;
    setToggling(true);
    const newAvail = toggleTarget.availability === 'Available' ? 'Not Available' : 'Available';
    try {
      await axios.put(`${API}/update/${toggleTarget._id}`, {
        ...toggleTarget,
        availability: newAvail,
      });
      addToast(`"${toggleTarget.itemName}" is now ${newAvail}.`, 'success');
      setToggleTarget(null);
      await fetchItems();
    } catch (err) {
      console.error(err);
      addToast('Could not update availability. Please try again.', 'error');
    } finally { setToggling(false); }
  };

  const availableCount = items.filter(i => i.availability === 'Available').length;

  /* ── Show Login if not authenticated ── */
  if (!isLoggedIn) {
    return (
      <>
        <ToastContainer />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="app-wrapper">
      <ToastContainer />

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-icon"><Share2 size={20} /></div>
          <div>
            <h1>Boarding <span>Resource</span> Sharing</h1>
            <p>Find &amp; share items with fellow boarders</p>
          </div>
        </div>

        <div className="header-actions">
          <span className="item-count-badge">{availableCount} Available</span>
          <button
            className="btn btn-ghost"
            onClick={fetchItems}
            title="Refresh"
            style={{ color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}
          >
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            <Plus size={18} /> Add Item
          </button>
          <button
            id="logout-btn"
            className="btn btn-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main-content">

        {/* Search */}
        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search the item..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch('')} title="Clear">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filter-row" style={{ marginBottom: '10px' }}>
          <div className="filter-select-wrap">
            <label className="filter-select-label">Category</label>
            <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-select-wrap">
            <label className="filter-select-label">Status</label>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUS_FILTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Not-found alert */}
        {notFound && (
          <div className="not-found-alert">
            <AlertTriangle size={18} />
            Item not found — try a different search term or clear the filters.
          </div>
        )}

        {/* Section header */}
        <div className="section-header" style={{ marginTop: '1rem' }}>
          <div className="section-title">
            <LayoutGrid size={16} />
            {search ? `Results for "${search}"` : 'All Shared Items'}
            <span>{filtered.length}</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 && !notFound ? (
          <div className="items-grid">
            <div className="empty-state">
              <div className="empty-state-icon"><Package size={36} /></div>
              <h3>No items yet</h3>
              <p>Be the first to share something with your fellow boarders!</p>
            </div>
          </div>
        ) : (
          <div className="items-grid">
            {filtered.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                onEdit={i => { setEditItem(i); setShowModal(true); }}
                onDelete={i => setConfirmTarget(i)}
                onToggle={i => setToggleTarget(i)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <ItemModal
          editItem={editItem}
          loading={saving}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {/* ── Delete Confirm ── */}
      {confirmTarget && (
        <ConfirmDialog
          title="Delete Item"
          message={<>Are you sure you want to delete <strong>"{confirmTarget.itemName}"</strong>?<br />This action cannot be undone.</>}
          confirmLabel="Delete"
          confirmClass="btn-danger"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmTarget(null)}
          isDanger
        />
      )}

      {/* ── Toggle Availability Confirm ── */}
      {toggleTarget && (
        <ConfirmDialog
          title="Change Availability"
          message={
            <>
              Are you sure you want to mark <strong>"{toggleTarget.itemName}"</strong> as{' '}
              <strong>{toggleTarget.availability === 'Available' ? 'Not Available' : 'Available'}</strong>?
            </>
          }
          confirmLabel="Yes, Update"
          confirmClass="btn-confirm-toggle"
          loading={toggling}
          onConfirm={handleToggleConfirm}
          onCancel={() => setToggleTarget(null)}
          isDanger={false}
        />
      )}
    </div>
  );
}
