/**
 * ===================================================================
 * STORIES ENGINE - GaleryQR2
 * Reproductor inmersivo vertical estilo TikTok / Instagram Stories
 * ===================================================================
 */

class LoveStoriesEngine {
  constructor() {
    this.modal = document.getElementById('storiesModal');
    this.progressContainer = document.getElementById('storiesProgressContainer');
    this.mediaLayer = document.getElementById('storyMediaLayer');
    this.titleEl = document.getElementById('storyTitle');
    this.textEl = document.getElementById('storyText');
    this.closeBtn = document.getElementById('storyCloseBtn');
    this.tapLeft = document.getElementById('storyTapLeft');
    this.tapRight = document.getElementById('storyTapRight');
    this.userNameEl = document.getElementById('storyUserName');
    this.monogramAvatarEl = document.getElementById('storyAvatar');

    this.stories = [];
    this.currentIndex = 0;
    this.timer = null;
    this.progressInterval = null;
    this.currentProgress = 0;
    this.isPaused = false;
    this.defaultDuration = 5000; // 5 segundos por defecto para fotos

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

  open(startIndex = 0) {
    if (!this.stories || this.stories.length === 0) return;
    this.currentIndex = startIndex;
    this.buildProgressBars();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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

    // Renderizar medios
    this.mediaLayer.innerHTML = '';
    let duration = (story.duracionSegundos || 5) * 1000;

    if (story.tipo === 'video') {
      const video = document.createElement('video');
      video.className = 'story-media-video';
      video.src = story.mediaUrl;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = false; // Sonido del video
      this.mediaLayer.appendChild(video);

      // Si el video tiene duración conocida, sincronizar
      video.onloadedmetadata = () => {
        if (video.duration && !isNaN(video.duration)) {
          duration = video.duration * 1000;
          this.startProgressBar(duration);
        }
      };

      video.onended = () => {
        this.next();
      };
    } else {
      const img = document.createElement('img');
      img.className = 'story-media-img';
      img.src = story.mediaUrl;
      img.alt = story.titulo || 'Historia de amor';
      this.mediaLayer.appendChild(img);
      this.startProgressBar(duration);
    }

    if (this.titleEl) this.titleEl.textContent = story.titulo || '';
    if (this.textEl) this.textEl.textContent = story.texto || '';
  }

  startProgressBar(duration) {
    const currentFill = document.getElementById(`story-progress-${this.currentIndex}`);
    if (!currentFill) return;

    this.currentProgress = 0;
    const stepTime = 50; // Cada 50ms actualizamos barra
    const totalSteps = duration / stepTime;
    const increment = 100 / totalSteps;

    this.progressInterval = setInterval(() => {
      if (this.isPaused) return;

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

  pause() {
    this.isPaused = true;
    const video = this.mediaLayer.querySelector('video');
    if (video) video.pause();
  }

  resume() {
    this.isPaused = false;
    const video = this.mediaLayer.querySelector('video');
    if (video) video.play();
  }

  clearTimers() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
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

    // Mantener presionado para pausar (estilo Instagram/TikTok)
    const holdArea = this.modal.querySelector('.stories-viewport');
    if (holdArea) {
      const handleHoldStart = () => this.pause();
      const handleHoldEnd = () => this.resume();

      holdArea.addEventListener('mousedown', handleHoldStart);
      holdArea.addEventListener('mouseup', handleHoldEnd);
      holdArea.addEventListener('touchstart', handleHoldStart, { passive: true });
      holdArea.addEventListener('touchend', handleHoldEnd, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });
  }
}

window.LoveStoriesEngine = LoveStoriesEngine;
