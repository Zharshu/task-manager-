import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          width: '100%', maxWidth: '380px', border: '1px solid var(--border)', overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        <div style={{ padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginBottom: '18px',
            boxShadow: '0 0 0 6px rgba(239, 68, 68, 0.05)'
          }}>
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{title}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{message}</p>
        </div>
        
        <div style={{ 
          display: 'flex', gap: '12px', padding: '16px 24px', backgroundColor: 'var(--bg-subtle)', 
          borderTop: '1px solid var(--border)' 
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid var(--border)',
              backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-input)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              backgroundColor: '#ef4444', color: '#fff', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
