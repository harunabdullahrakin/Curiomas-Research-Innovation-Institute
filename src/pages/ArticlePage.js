/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Article Reader Page Component
 */

import { renderCurveDivider } from '../components/CurveDivider.js';

export function renderArticlePageHtml() {
  return `
    <div class="page-article-wrapper">
      <section class="mockup-page-hero" style="min-height: 280px; padding: 7rem 0 3.5rem 0;">
        <div class="mockup-container">
          <div class="mockup-page-hero-body" style="max-width: 860px;">
            <div style="font-size: 0.86rem; color: #94a3b8; margin-bottom: 1.25rem;">
              <a href="/" style="color: inherit; text-decoration: none;">Home</a> / 
              <a href="/blog" style="color: inherit; text-decoration: none;">Dispatches</a> / 
              <span id="postCategoryHero" style="color: #38bdf8; font-weight: 600;">Article</span>
            </div>
            <h1 id="postHeroTitle" class="mockup-page-hero-title" style="font-size: 2.75rem; line-height: 1.15;"></h1>
          </div>
        </div>
      </section>

      <!-- Wave from Page Hero into Content -->
      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <main class="mockup-page-content" style="padding: 3.5rem 0 6rem 0;">
        <div class="mockup-container" style="max-width: 860px;" id="articleContainer">
          <!-- Article Meta -->
          <div style="margin-bottom: 2.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-size: 0.86rem; color: #6b7280; flex-wrap: wrap;">
              <span id="postDate"></span>
              <span>•</span>
              <span id="postReadTime"></span>
              <span>•</span>
              <span id="postDoi" style="color: #0284c7; font-family: monospace;"></span>
            </div>

            <h1 id="postTitle" style="font-size: 2.65rem; line-height: 1.2; margin-bottom: 1.25rem; color: #16281e; letter-spacing: -0.025em;"></h1>

            <div style="font-size: 1.05rem; color: #4b5563; margin-bottom: 1.25rem;">
              <strong>Authors:</strong> <span id="postAuthors" style="color: #16281e; font-weight: 600;"></span>
            </div>

            <div id="postUpdatedMeta" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.82rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; color: #047857; font-weight: 600;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
              <span id="postUpdatedText"></span>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.25rem 0; border-top: 1px solid #e5dfd5; border-bottom: 1px solid #e5dfd5;">
              <button id="citePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Cite This Paper</button>
              <button id="sharePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Share Article</button>
              <a href="/research" class="btn btn-glass btn-sm" style="border-radius: 9999px;">Browse Datasets</a>
            </div>
          </div>

          <!-- Article Cover Image -->
          <div id="postCoverWrapper" style="margin-bottom: 2.5rem;"></div>

          <!-- Abstract Box -->
          <div id="postAbstract" style="margin-bottom: 2rem;"></div>

          <!-- Article Body -->
          <article id="postContent" style="margin-bottom: 4rem; line-height: 1.8; font-size: 1.08rem; color: #2d3748;"></article>

          <!-- Keywords / Tags -->
          <div style="padding: 1.75rem 0; border-top: 1px solid #e5dfd5; margin-bottom: 3.5rem;">
            <span style="font-size: 0.78rem; text-transform: uppercase; color: #78716c; font-weight: 700; display: block; margin-bottom: 0.65rem; letter-spacing: 0.08em;">Keywords</span>
            <div id="postTags" style="display: flex; flex-wrap: wrap; gap: 0.45rem;"></div>
          </div>

          <!-- Institute Citation Callout -->
          <div style="background: #ffffff; padding: 2rem; display: flex; gap: 1.25rem; align-items: center; border-radius: 12px; border: 1px solid #e5dfd5; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(37, 99, 235, 0.1); color: #0284c7; display: grid; place-items: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <div>
              <h4 style="font-size: 1.15rem; margin-bottom: 0.35rem; color: #16281e;">Curiomas Research & Innovation Institute</h4>
              <p style="font-size: 0.92rem; line-height: 1.6; color: #5f6862; margin: 0;">
                Authored by student researchers at CRII under open science principles. "Turning Curiosity into Action."
              </p>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer Wave Divider -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#071f16' })}
    </div>
  `;
}

export async function mountArticlePage() {
  if (typeof window.initArticleReader === 'function') {
    window.initArticleReader();
  }
  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}
