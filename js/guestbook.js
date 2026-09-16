/**
 * ===================================================================
 * GUESTBOOK & INTERACTIONS - GaleryQR2
 * Muro de dedicatorias, retos de fotos y animaciones interactivas
 * ===================================================================
 */

class GuestbookManager {
  constructor() {
    this.form = document.getElementById('guestbookForm');
    this.wishesStream = document.getElementById('wishesStream');
    this.challengesList = document.getElementById('challengesList');
    this.authorInput = document.getElementById('wishAuthor');
    this.messageInput = document.getElementById('wishMessage');
    this.uploadBtn = document.getElementById('btnUploadPhotos');
    this.whatsappBtn = document.getElementById('btnWhatsappPhotos');

    this.storageKey = 'galeryqr2_guest_wishes';
  }

  init(config) {
    if (!config?.rinconInvitados) return;

    // Configurar enlaces de subida de fotos
    if (this.uploadBtn && config.rinconInvitados.enlaceSubirFotos) {
      this.uploadBtn.href = config.rinconInvitados.enlaceSubirFotos;
    }

    if (this.whatsappBtn && config.rinconInvitados.enlaceWhatsApp) {
      this.whatsappBtn.href = config.rinconInvitados.enlaceWhatsApp;
    }

    // Renderizar retos fotográficos
    this.renderChallenges(config.rinconInvitados.retosFotograficos);

    // Cargar dedicatorias (locales + ejemplos por defecto)
    this.loadWishes(config.rinconInvitados.mensajesEjemplo);

    // Evento de envío de dedicatoria
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  renderChallenges(challenges) {
    if (!this.challengesList || !challenges) return;
    this.challengesList.innerHTML = '';
    challenges.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'challenge-item';
      li.innerHTML = `
        <span class="challenge-icon">${item.icono || '📷'}</span>
        <span class="challenge-text">${item.reto}</span>
      `;
      this.challengesList.appendChild(li);
    });
  }

  loadWishes(defaultWishes) {
    if (!this.wishesStream) return;

    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {
      saved = [];
    }

    const allWishes = [...saved, ...(defaultWishes || [])];
    this.renderWishes(allWishes);
  }

  renderWishes(wishes) {
    this.wishesStream.innerHTML = '';
    wishes.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-card-header">
          <span class="wish-author">${this.escapeHTML(item.autor)}</span>
          <span class="wish-date">${this.escapeHTML(item.fecha || 'Hoy')}</span>
        </div>
        <p class="wish-text">${this.escapeHTML(item.mensaje)}</p>
      `;
      this.wishesStream.appendChild(card);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const author = this.authorInput.value.trim();
    const message = this.messageInput.value.trim();

    if (!author || !message) return;

    const newWish = {
      autor: author,
      mensaje: message,
      fecha: 'Ahora mismo'
    };

    // Guardar en localStorage
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (err) {
      saved = [];
    }
    saved.unshift(newWish);
    localStorage.setItem(this.storageKey, JSON.stringify(saved));

    // Agregar visualmente al inicio
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.style.animation = 'fadeIn 0.5s ease';
    card.innerHTML = `
      <div class="wish-card-header">
        <span class="wish-author">${this.escapeHTML(newWish.autor)}</span>
        <span class="wish-date">${newWish.fecha}</span>
      </div>
      <p class="wish-text">${this.escapeHTML(newWish.mensaje)}</p>
    `;
    this.wishesStream.prepend(card);

    // Disparar animación de corazones flotantes
    this.spawnFloatingHearts();

    // Limpiar formulario
    this.authorInput.value = '';
    this.messageInput.value = '';
  }

  spawnFloatingHearts() {
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.textContent = ['❤️', '💖', '✨', '💍', '🥂'][Math.floor(Math.random() * 5)];
      heart.style.position = 'fixed';
      heart.style.left = `${Math.random() * 80 + 10}vw`;
      heart.style.bottom = '40px';
      heart.style.fontSize = `${Math.random() * 20 + 20}px`;
      heart.style.zIndex = '9999';
      heart.style.pointerEvents = 'none';
      heart.style.transition = 'all 2s ease-out';
      heart.style.opacity = '1';

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.transform = `translateY(-${Math.random() * 300 + 200}px) scale(1.4)`;
        heart.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        heart.remove();
      }, 2100);
    }
  }

  escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }
}

window.GuestbookManager = GuestbookManager;
