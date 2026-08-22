(function () {
  const projectName = "StayHub Luxury";
  const projectUrl = "https://alxnrocha.github.io/booking-platform/";
  const description = "Plataforma Multi-Tenant de Aluguel Vacacional & RBAC";

  const badgeHtml = `
    <style>
      .author-project-badge {
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 99999;
        max-width: 340px;
        width: calc(100vw - 32px);
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 14px;
        padding: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        color: #f0f6fc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 13px;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 1;
        transform: translateY(0);
        box-sizing: border-box;
      }
      .author-project-badge.is-hidden {
        opacity: 0;
        transform: translateY(16px);
        pointer-events: none;
      }
      .author-project-badge * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .badge-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      .badge-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .badge-tag-wrap {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 6px;
        background: #238636;
        color: #ffffff;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .badge-close {
        background: transparent;
        border: none;
        color: #8b949e;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: color 0.15s ease;
      }
      .badge-close:hover {
        color: #ffffff;
        background: #21262d;
      }
      .badge-url {
        margin-bottom: 8px;
      }
      .badge-url a {
        color: #58a6ff;
        text-decoration: underline;
        font-size: 12px;
        font-family: monospace;
        word-break: break-all;
        display: block;
      }
      .badge-desc {
        color: #8b949e;
        font-size: 11px;
        line-height: 1.4;
        margin-bottom: 12px;
      }
      .badge-desc a {
        color: #c9d1d9;
        font-weight: 600;
        text-decoration: none;
      }
      .badge-desc a:hover {
        color: #58a6ff;
        text-decoration: underline;
      }
      .badge-footer {
        padding-top: 8px;
        border-top: 1px solid #21262d;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 10px;
        color: #8b949e;
      }
      .badge-status {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .badge-active {
        color: #3fb950;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .badge-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #238636;
        display: inline-block;
      }
      .badge-divider {
        color: #484f58;
      }
      .badge-branch {
        color: #c9d1d9;
        font-family: monospace;
      }
    </style>

    <div class="author-project-badge" id="authorProjectBadge">
      <div class="badge-header">
        <span class="badge-title">${projectName}</span>
        <div class="badge-tag-wrap">
          <span class="badge-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            MEU PROJETO
          </span>
          <button class="badge-close" id="authorBadgeClose" title="Fechar (retorna em 5s)" aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="badge-url">
        <a href="${projectUrl}" target="_blank" rel="noopener noreferrer">${projectUrl}</a>
      </div>

      <p class="badge-desc">
        ${description} • Desenvolvido por <a href="https://github.com/alxnrocha" target="_blank" rel="noopener noreferrer">Alexandre Rocha (@alxnrocha)</a>
      </p>

      <div class="badge-footer">
        <div class="badge-status">
          <span class="badge-active"><span class="badge-dot"></span> ATIVO</span>
          <span class="badge-divider">|</span>
          <span class="badge-branch">⑂ main</span>
        </div>
        <span>Atualizado recentemente</span>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.createElement('div');
    container.innerHTML = badgeHtml;
    document.body.appendChild(container);

    const badge = document.getElementById('authorProjectBadge');
    const closeBtn = document.getElementById('authorBadgeClose');

    if (badge && closeBtn) {
      closeBtn.addEventListener('click', function () {
        badge.classList.add('is-hidden');
        setTimeout(function () {
          badge.classList.remove('is-hidden');
        }, 5000);
      });
    }
  });
})();
