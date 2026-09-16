/**
 * ===================================================================
 * STORIES ENGINE - GaleryQR2
 * Reproductor inmersivo vertical estilo TikTok / Instagram Stories
 * Totalmente adaptado a móviles con gestos, safe-area y soporte de video
 * ===================================================================
 */

class LoveStoriesEngine {
  constructor() {
    this.modal = document.getElementById('storiesModal');
    this.viewport = document.getElementById('storiesViewport');
    this.progressContainer = document.getElementById('storiesProgressContainer');
    this.mediaLayer = document.getElementById('storyMediaLayer');
    this.loader = document.getElementById('storyLoader');
    this.titleEl = document.getElementById('storyTitle');
    this.textEl = document.getElementById('storyText');
    this.badgeEl = document.getElementById('storyBadge');
    this.closeBtn = document.getElementById('storyCloseBtn');
    this.soundBtn = document.getElementById('storySoundBtn');
    this.tapLeft = document.getElementById('storyTapLeft');
    this.tapRight = document.getElementById('storyTapRight');
    this.desktopPrev = document.getElementById('storiesDesktopPrev');
    this.desktopNext = document.getElementById('storiesDesktopNext');
    this.userNameEl = document.getElementById('storyUserName');
    this.subtitleEl = document.getElementById('storySubtitle');
    this.monogramAvatarEl = document.getElementById('storyAvatar');

    this.stories = [];
    this.currentIndex = 0;
    this.progressInterval = null;
    this.currentProgress = 0;
    this.isPaused = false;
    this.isHolding = false;
    this.isMuted = true; // Por defecto muteado para garantizar autoplay sin bloqueo de navegadores móviles

    // Hooks opcionales para pausar/reanudar música ambiental
    this.onOpenCallback = null;
    this.onCloseCallback = null;

    // Variables para gestos táctiles (Swipe)
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;

    this.initEvents();
  }

  init(stories, config) {
    this.stories = stories || [];
    if (this.userNameEl && config?.pareja) {
      this.userNameEl.textContent = `${config.pareja.novia} & ${config.pareja.novio}`;
    }
    if (this.monogramAvatarEl && config?.pareja) {
      this.monogramAvatarEl.textContent = config.pareja.monograma || 'V & J';
    }
  }

  setAudioCallbacks({ onOpen, onClose }) {
    this.onOpenCallback = onOpen;
    this.onCloseCallback = onClose;
  }

  open(startIndex = 0) {
    if (!this.stories || this.stories.length === 0) return;
    this.currentIndex = startIndex;
    this.buildProgressBars();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof this.onOpenCallback === 'function') {
      this.onOpenCallback();
    }

    this.playStory(this.currentIndex);
  }

  close() {
    this.clearTimers();
    this.modal.classList.remove('active');
    document.body.style.overflow = '';

    const video = this.mediaLayer.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }

    if (this.viewport) {
      this.viewport.classList.remove('is-holding');
    }

    if (typeof this.onCloseCallback === 'function') {
      this.onCloseCallback();
    }
  }

  buildProgressBars() {
    this.progressContainer.innerHTML = '';
    this.stories.forEach((_, idx) => {
      const seg = document.createElement('div');
      seg.className = 'story-progress-segment';
      const fill = document.createElement('div');
      fill.className = 'story-progress-fill';
      fill.id = `story-progress-${idx}`;
      seg.appendChild(fill);
      this.progressContainer.appendChild(seg);
    });
  }

  updateProgressBarsState() {
    this.stories.forEach((_, idx) => {
      const fill = document.getElementById(`story-progress-${idx}`);
      if (!fill) return;
      if (idx < this.currentIndex) {
        fill.style.width = '100%';
      } else if (idx > this.currentIndex) {
        fill.style.width = '0%';
      }
    });
  }

  playStory(index) {
    this.clearTimers();
    this.currentIndex = index;
    const story = this.stories[this.currentIndex];
    if (!story) {
      this.close();
      return;
    }

    this.updateProgressBarsState();

    // Actualizar Textos y Badges
    if (this.badgeEl) {
      this.badgeEl.textContent = `✨ Momento ${this.currentIndex + 1} de ${this.stories.length}`;
    }
    if (this.titleEl) this.titleEl.textContent = story.titulo || '';
    if (this.textEl) this.textEl.textContent = story.texto || '';

    // Renderizar medios
    this.mediaLayer.innerHTML = '';
    let duration = (story.duracionSegundos || 5) * 1000;

    if (story.tipo === 'video') {
      if (this.soundBtn) {
        this.soundBtn.classList.add('visible');
        this.soundBtn.classList.toggle('is-muted', this.isMuted);
      }

      if (this.loader) this.loader.classList.add('active');

      const video = document.createElement('video');
      video.className = 'story-media-video';
      video.src = story.mediaUrl;
      video.poster = story.previewUrl || '';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'auto';
      video.muted = this.isMuted;
      this.mediaLayer.appendChild(video);

      const hideLoader = () => {
        if (this.loader) this.loader.classList.remove('active');
      };

      video.addEventListener('loadeddata', hideLoader, { once: true });
      video.addEventListener('canplay', hideLoader, { once: true });
      video.addEventListener('playing', hideLoader);
      video.addEventListener('waiting', () => {
        if (this.loader) this.loader.classList.add('active');
      });

      video.onloadedmetadata = () => {
        if (video.duration && !isNaN(video.duration)) {
          duration = video.duration * 1000;
          this.startProgressBar(duration);
        }
      };

      // Intentar reproducción resiliente (Fallback a muted si políticas de browser bloquean audio)
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay bloqueado por políticas de navegador, reproduciendo en silencio:', err);
          this.isMuted = true;
          video.muted = true;
          if (this.soundBtn) this.soundBtn.classList.add('is-muted');
          video.play().catch(() => {});
        });
      }

      video.onended = () => {
        this.next();
      };

      video.onerror = () => {
        hideLoader();
        console.warn('Error al cargar video, mostrando imagen de vista previa');
        if (story.previewUrl) {
          const fallbackImg = document.createElement('img');
          fallbackImg.className = 'story-media-img';
          fallbackImg.src = story.previewUrl;
          this.mediaLayer.innerHTML = '';
          this.mediaLayer.appendChild(fallbackImg);
        }
        this.startProgressBar(duration);
      };

      // Si metadata ya estaba disponible
      if (video.duration && !isNaN(video.duration)) {
        duration = video.duration * 1000;
        this.startProgressBar(duration);
      } else {
        this.startProgressBar(duration);
      }
    } else {
      if (this.soundBtn) {
        this.soundBtn.classList.remove('visible');
      }

      if (this.loader) this.loader.classList.add('active');

      const img = document.createElement('img');
      img.className = 'story-media-img';
      img.src = story.mediaUrl;
      img.alt = story.titulo || 'Historia de amor';
      img.onload = () => {
        if (this.loader) this.loader.classList.remove('active');
      };
      img.onerror = () => {
        if (this.loader) this.loader.classList.remove('active');
      };
      this.mediaLayer.appendChild(img);

      this.startProgressBar(duration);
    }
  }

  startProgressBar(duration) {
    const currentFill = document.getElementById(`story-progress-${this.currentIndex}`);
    if (!currentFill) return;

    this.currentProgress = 0;
    const stepTime = 50;
    const totalSteps = duration / stepTime;
    const increment = 100 / totalSteps;

    this.progressInterval = setInterval(() => {
      if (this.isPaused || this.isHolding) return;

      this.currentProgress += increment;
      if (this.currentProgress >= 100) {
        currentFill.style.width = '100%';
        clearInterval(this.progressInterval);
        this.next();
      } else {
        currentFill.style.width = `${this.currentProgress}%`;
      }
    }, stepTime);
  }

  next() {
    if (this.currentIndex < this.stories.length - 1) {
      this.playStory(this.currentIndex + 1);
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.playStory(this.currentIndex - 1);
    } else {
      this.playStory(0);
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    if (this.soundBtn) {
      this.soundBtn.classList.toggle('is-muted', this.isMuted);
    }
    const video = this.mediaLayer.querySelector('video');
    if (video) {
      video.muted = this.isMuted;
      if (!this.isMuted) {
        video.play().catch(() => {});
      }
    }
  }

  pause() {
    this.isPaused = true;
    const video = this.mediaLayer.querySelector('video');
    if (video) video.pause();
  }

  resume() {
    this.isPaused = false;
    const video = this.mediaLayer.querySelector('video');
    if (video) video.play().catch(() => {});
  }

  clearTimers() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }

    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSound();
      });
    }

    if (this.tapLeft) {
      this.tapLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }

    if (this.tapRight) {
      this.tapRight.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    if (this.desktopPrev) {
      this.desktopPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }

    if (this.desktopNext) {
      this.desktopNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    // Mantener presionado (Hold to Pause) estilo Instagram / TikTok
    const handleHoldStart = (e) => {
      // Ignorar si el toque fue en los botones de control
      if (e.target.closest('.story-btn') || e.target.closest('.stories-desktop-nav')) return;

      this.isHolding = true;
      if (this.viewport) this.viewport.classList.add('is-holding');
      this.pause();
    };

    const handleHoldEnd = () => {
      if (this.isHolding) {
        this.isHolding = false;
        if (this.viewport) this.viewport.classList.remove('is-holding');
        this.resume();
      }
    };

    if (this.viewport) {
      this.viewport.addEventListener('mousedown', handleHoldStart);
      this.viewport.addEventListener('mouseup', handleHoldEnd);
      this.viewport.addEventListener('mouseleave', handleHoldEnd);

      // Soporte para gestos táctiles (Hold + Swipe down para cerrar)
      this.viewport.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          this.touchStartX = e.touches[0].clientX;
          this.touchStartY = e.touches[0].clientY;
          this.touchStartTime = Date.now();
          handleHoldStart(e);
        }
      }, { passive: true });

      this.viewport.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - this.touchStartTime;
        handleHoldEnd();

        if (e.changedTouches && e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - this.touchStartX;
          const deltaY = e.changedTouches[0].clientY - this.touchStartY;

          // Deslizar hacia abajo para cerrar (Swipe Down)
          if (deltaY > 80 && Math.abs(deltaY) > Math.abs(deltaX) && touchDuration < 400) {
            this.close();
            return;
          }

          // Deslizar horizontal (Swipe Left / Right)
          if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) && touchDuration < 400) {
            if (deltaX < 0) {
              this.next();
            } else {
              this.prev();
            }
          }
        }
      }, { passive: true });

      this.viewport.addEventListener('touchcancel', handleHoldEnd, { passive: true });
    }

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'm' || e.key === 'M') this.toggleSound();
    });
  }
}

window.LoveStoriesEngine = LoveStoriesEngine;
