import React, { useState, useEffect } from 'react';

export const ProjectBadge: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isVisible) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Informações do Projeto"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 99999,
        maxWidth: '340px',
        width: 'calc(100vw - 32px)',
        backgroundColor: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        color: '#f0f6fc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        letterSpacing: 'normal',
        lineHeight: 1.4,
        userSelect: 'none',
        boxSizing: 'border-box',
        textAlign: 'left',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif', letterSpacing: 'normal' }}>
          StayHub Luxury
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <a
            href="https://github.com/alxnrocha"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver perfil de Alexandre Rocha no GitHub"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#238636', color: '#ffffff', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px', textDecoration: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>@alxnrocha</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          <button
            onClick={() => setIsVisible(false)}
            title="Fechar (retorna em 5s)"
            aria-label="Fechar"
            style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* URL Link */}
      <div style={{ marginBottom: '8px' }}>
        <a href="https://alxnrocha.github.io/booking-platform/" target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'underline', fontSize: '12px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', wordBreak: 'break-all', display: 'block' }}>
          https://alxnrocha.github.io/booking-platform/
        </a>
      </div>

      {/* Description */}
      <p style={{ color: '#8b949e', fontSize: '11px', lineHeight: 1.4, margin: '0 0 12px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif' }}>
        Plataforma Multi-Tenant de Aluguel Vacacional & RBAC • Desenvolvido por <a href="https://github.com/alxnrocha" target="_blank" rel="noopener noreferrer" style={{ color: '#e6edf3', fontWeight: 600, textDecoration: 'none' }}>Alexandre Rocha</a>
      </p>

      {/* Footer */}
      <footer style={{ paddingTop: '8px', borderTop: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#8b949e', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#3fb950', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#238636', display: 'inline-block' }} />
            ATIVO
          </span>
          <span style={{ color: '#484f58' }}>|</span>
          <span style={{ color: '#c9d1d9', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>⑂ main</span>
        </div>
        <a href="https://github.com/alxnrocha" target="_blank" rel="noopener noreferrer" style={{ color: '#8b949e', textDecoration: 'none', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
          github.com/alxnrocha
        </a>
      </footer>
    </aside>
  );
};
