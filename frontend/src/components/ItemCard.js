import { Pencil, Trash2, Home, Phone, Tag, User } from 'lucide-react';

export default function ItemCard({ item, onEdit, onDelete, onToggle }) {
  const isAvailable = item.availability === 'Available';

  return (
    <div className="item-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-item-name" title={item.itemName}>{item.itemName}</div>
          {item.category && (
            <div className="card-category">
              <Tag size={10} />{item.category}
            </div>
          )}
        </div>
        <div className="card-actions">
          <button className="btn btn-ghost" title="Edit" onClick={() => onEdit(item)} aria-label={`Edit ${item.itemName}`}>
            <Pencil size={15} />
          </button>
          <button className="btn btn-danger-ghost" title="Delete" onClick={() => onDelete(item)} aria-label={`Delete ${item.itemName}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        {item.ownerName && (
          <div className="card-detail">
            <div className="card-detail-icon"><User size={14} /></div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>Owner</div>
              <div className="card-detail-value">{item.ownerName}</div>
            </div>
          </div>
        )}

        {item.boardingAddress && (
          <div className="card-detail">
            <div className="card-detail-icon"><Home size={14} /></div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>Address</div>
              <div className="card-detail-value">{item.boardingAddress}</div>
            </div>
          </div>
        )}

        <div className="card-detail">
          <div className="card-detail-icon"><Phone size={14} /></div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>Contact</div>
            <div className="card-detail-value">
              <a
                href={`tel:${item.contact}`}
                style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.3px' }}
              >
                {item.contact}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — status badge + toggle switch */}
      <div className="card-footer">
        <div className={`status-badge ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
          <span className="dot" />
          {isAvailable ? 'Available' : 'Not Available'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Availability toggle */}
          <button
            className={`avail-toggle ${isAvailable ? 'toggle-on' : 'toggle-off'}`}
            onClick={() => onToggle(item)}
            title={`Mark as ${isAvailable ? 'Not Available' : 'Available'}`}
            aria-label="Toggle availability"
          >
            <span className="toggle-thumb" />
          </button>

          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            #{item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
