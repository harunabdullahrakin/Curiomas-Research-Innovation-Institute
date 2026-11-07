/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Global Search Overlay Modal Component
 */

export function renderSearchModalHtml() {
  return `
    <div class="crii-search-overlay" id="criiSearchOverlay" aria-hidden="true" style="display:none;">
      <div class="crii-search-backdrop" id="criiSearchBackdrop"></div>
      <div class="crii-search-modal">
        <div class="crii-search-header">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" class="crii-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="siteSearchInput" class="crii-search-input" placeholder="Search dispatches, research, topics..." autocomplete="off" spellcheck="false">
          <kbd class="crii-search-esc" id="criiSearchEsc">ESC</kbd>
        </div>
        <div class="crii-search-quick-tags" id="criiSearchQuickTags">
          <span class="quick-tag-label">Suggested:</span>
          <button type="button" class="quick-tag-btn" data-query="Spectra">Spectra</button>
          <button type="button" class="quick-tag-btn" data-query="Biophysics">Biophysics</button>
          <button type="button" class="quick-tag-btn" data-query="Paleogenomics">Paleogenomics</button>
          <button type="button" class="quick-tag-btn" data-query="Habitability">Habitability</button>
        </div>
        <div class="crii-search-body" id="criiSearchResults">
          <div class="crii-search-empty">Type keywords or click a suggestion above to search...</div>
        </div>
        <div class="crii-search-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  `;
}

export function initSearchModal(router) {
  const overlay = document.getElementById('criiSearchOverlay');
  const backdrop = document.getElementById('criiSearchBackdrop');
  const input = document.getElementById('siteSearchInput');
  const results = document.getElementById('criiSearchResults');
  const escBtn = document.getElementById('criiSearchEsc');
  const quickTags = document.getElementById('criiSearchQuickTags');

  if (!overlay || !input) return;

  function openSearch(initialQuery = '') {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-modal-open');
    if (initialQuery) {
      input.value = initialQuery;
      performSearch(initialQuery);
    } else {
      input.value = '';
      if (results) results.innerHTML = '<div class="crii-search-empty">Type keywords or click a suggestion above to search...</div>';
    }
    setTimeout(() => input.focus(), 60);
  }

  function closeSearch() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-modal-open');
    input.value = '';
  }

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.style.display === 'flex') closeSearch();
      else openSearch();
    } else if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeSearch();
    }
  });

  if (backdrop) backdrop.addEventListener('click', closeSearch);
  if (escBtn) escBtn.addEventListener('click', closeSearch);

  if (quickTags) {
    quickTags.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-tag-btn');
      if (btn) {
        const q = btn.getAttribute('data-query');
        input.value = q;
        performSearch(q);
      }
    });
  }

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(input.value.trim());
    }, 180);
  });

  async function performSearch(query) {
    if (!results) return;
    if (!query) {
      results.innerHTML = '<div class="crii-search-empty">Type keywords or click a suggestion above to search...</div>';
      return;
    }

    let posts = [];
    if (window.CRII_API && typeof window.CRII_API.getPosts === 'function') {
      try {
        posts = await window.CRII_API.getPosts();
      } catch (e) {}
    }

    const qLower = query.toLowerCase();
    const matched = posts.filter(p => {
      const t = (p.title || '').toLowerCase();
      const a = (p.author || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      const e = (p.excerpt || '').toLowerCase();
      return t.includes(qLower) || a.includes(qLower) || c.includes(qLower) || e.includes(qLower);
    });

    if (matched.length === 0) {
      results.innerHTML = `<div class="crii-search-empty">No results found for "<strong>${escapeHtml(query)}</strong>". Try searching for <em>Spectra</em>, <em>Biophysics</em>, or <em>Habitability</em>.</div>`;
      return;
    }

    results.innerHTML = matched.map((p, idx) => {
      const href = p.slug ? `/article?id=${p.slug}` : `/article?id=${p.id}`;
      return `
        <a href="${href}" class="crii-search-result-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <div class="result-title">${escapeHtml(p.title)}</div>
          <div class="result-meta">
            <span>${escapeHtml(p.author || 'CRII Researcher')}</span>
            <span>•</span>
            <span>${escapeHtml(p.category || 'Science')}</span>
            <span>•</span>
            <span>${p.readTime || '4 min read'}</span>
          </div>
          ${p.excerpt ? `<div class="result-snippet">${escapeHtml(p.excerpt)}</div>` : ''}
        </a>
      `;
    }).join('');

    // Handle clicking a search result via SPA router
    results.querySelectorAll('.crii-search-result-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const href = el.getAttribute('href');
        closeSearch();
        if (router) router.navigate(href);
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  window.CRII_OPEN_SEARCH = openSearch;
  window.CRII_CLOSE_SEARCH = closeSearch;
}
