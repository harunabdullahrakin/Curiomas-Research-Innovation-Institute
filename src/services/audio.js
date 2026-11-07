/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Background Ambient Audio Engine
 * Persists smoothly across client-side SPA navigation
 */

class AudioController {
  constructor() {
    this.isPlaying = false;
    this.isMuted = false;
    this.videoEl = null;
    this.buttonEl = null;
    this.userInteracted = false;
  }

  init(buttonId = 'heroSoundToggle') {
    this.buttonEl = document.getElementById(buttonId);
    this.videoEl = document.getElementById('heroVideo');

    if (!this.buttonEl) return;

    this.buttonEl.addEventListener('click', () => this.toggleSound());

    // Auto-unmute on first user interaction if browser policy blocked autoplay audio
    const handleFirstInteraction = () => {
      if (this.userInteracted) return;
      this.userInteracted = true;
      if (this.videoEl && !this.isMuted) {
        this.videoEl.muted = false;
        this.videoEl.play().catch(() => {});
        this.updateButtonUI(true);
      }
      window.removeEventListener('click', handleFirstInteraction, { capture: true });
      window.removeEventListener('keydown', handleFirstInteraction, { capture: true });
    };

    window.addEventListener('click', handleFirstInteraction, { capture: true, once: true });
    window.addEventListener('keydown', handleFirstInteraction, { capture: true, once: true });
  }

  attachVideo(videoEl) {
    this.videoEl = videoEl;
    if (this.videoEl) {
      this.videoEl.muted = this.isMuted;
    }
  }

  toggleSound() {
    if (!this.videoEl) return;
    if (this.videoEl.muted) {
      this.videoEl.muted = false;
      this.isMuted = false;
      this.videoEl.play().catch(() => {});
      this.updateButtonUI(true);
    } else {
      this.videoEl.muted = true;
      this.isMuted = true;
      this.updateButtonUI(false);
    }
  }

  updateButtonUI(unmuted) {
    if (!this.buttonEl) return;
    if (unmuted) {
      this.buttonEl.classList.add('is-playing');
      this.buttonEl.title = 'Mute Sound';
      this.buttonEl.innerHTML = `
        <span class="hero-sound-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        </span>
      `;
    } else {
      this.buttonEl.classList.remove('is-playing');
      this.buttonEl.title = 'Play Sound';
      this.buttonEl.innerHTML = `
        <span class="hero-sound-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </span>
      `;
    }
  }
}

export const audioController = new AudioController();
