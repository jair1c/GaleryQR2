/**
 * ===================================================================
 * LIGHTBOX MODULE - GaleryQR2
 * Visor a pantalla completa para fotos y videos con navegación táctil
 * ===================================================================
 */

class GalleryLightbox {
  constructor() {
    this.modal = document.getElementById('lightboxModal');
    this.container = document.getElementById('lightboxMediaContainer');
    this.titleEl = document.getElementById('lightboxTitle');
    this.subtitleEl = document.getElementById('lightboxSubtitle');
    this.counterEl = document.getElementById('lightboxCounter');
    this.closeBtn = document.getElementById('lightboxClose');
    this.prevBtn = document.getElementById('lightboxPrev');
    this.nextBtn = document.getElementById('lightboxNext');

    this.items = [];
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.initEvents();
  }

  setItems(items) {
    this.items = items;
  }

  open(index) {
    if (!this.items || this.items.length === 0) return;
    this.currentIndex = (index >= 0 && index < this.items.length) ? index : 0;
    this.renderCurrent();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    // Detener video si estaba reproduciéndose
    const video = this.container.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
  }

  renderCurrent() {
    const item = this.items[this.currentIndex];
    if (!item) return;

    this.container.innerHTML = '';

    if (item.tipo === 'video') {
      const video = document.createElement('video');
      video.className = 'lightbox-video';
      video.src = item.mediaUrl;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.poster = item.previewUrl || '';
      this.container.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.className = 'lightbox-image';
      img.src = item.mediaUrl;
      img.alt = item.titulo || 'Recuerdo de los novios';
      this.container.appendChild(img);
    }

    if (this.titleEl) this.titleEl.textContent = item.titulo || '';
    if (this.subtitleEl) this.subtitleEl.textContent = item.subtitulo || item.descripcion || '';
    if (this.counterEl) {
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }
  }

  next() {
    if (this.items.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.renderCurrent();
  }

  prev() {
    if (this.items.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.renderCurrent();
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }

    // Clic fuera del diálogo para cerrar
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Teclas de teclado (Escape, Flechas)
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    // Soporte para gestos táctiles Swipe en móvil
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    const threshold = 50; // Mínimo 50px de desplazamiento
    if (diff > threshold) {
      this.prev();
    } else if (diff < -threshold) {
      this.next();
    }
  }
}

window.GalleryLightbox = GalleryLightbox;
