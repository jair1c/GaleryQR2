/**
 * ===================================================================
 * APP COORDINATOR - GaleryQR2
 * Renderizado dinámico, audio de fondo, filtros y eventos principales
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.GALLERY_CONFIG;
  if (!config) {
    console.error('No se encontró window.GALLERY_CONFIG');
    return;
  }

  // Inicializar componentes
  const lightbox = new window.GalleryLightbox();
  const stories = new window.LoveStoriesEngine();
  const guestbook = new (window.GuestAlbumManager || window.GuestbookManager)();

  stories.init(config.stories, config);
  guestbook.init(config);

  // Elementos del DOM
  const brandMonogram = document.getElementById('brandMonogram');
  const heroTagline = document.getElementById('heroTagline');
  const heroTitle = document.getElementById('heroTitle');
  const heroDescription = document.getElementById('heroDescription');
  const heroArtCard = document.getElementById('heroArtCard');
  const heroBadgeDate = document.getElementById('heroBadgeDate');
  const heroBadgeLocation = document.getElementById('heroBadgeLocation');
  const btnOpenStories = document.getElementById('btnOpenStories');

  const timelineContainer = document.getElementById('timelineItemsContainer');
  const galleryGrid = document.getElementById('galleryGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  const footerMonogram = document.getElementById('footerMonogram');
  const footerQuote = document.getElementById('footerQuote');
  const footerSub = document.getElementById('footerSub');
  const footerHashtag = document.getElementById('footerHashtag');

  // Reproductor de Música Ambiental
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');
  let audioPlayer = null;
  let isMusicPlaying = false;

  if (config.musica && config.musica.habilitada && config.musica.urlAudio) {
    audioPlayer = new Audio(config.musica.urlAudio);
    audioPlayer.loop = true;
    audioPlayer.volume = 0.45;

    musicToggleBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        audioPlayer.pause();
        isMusicPlaying = false;
        musicToggleBtn.classList.remove('playing');
        musicLabel.textContent = 'Música';
      } else {
        audioPlayer.play().then(() => {
          isMusicPlaying = true;
          musicToggleBtn.classList.add('playing');
          musicLabel.textContent = 'Pausar';
        }).catch((err) => {
          console.log('Interacción de usuario requerida para reproducir audio:', err);
        });
      }
    });

    // Pausar música ambiental si se abren las historias / videos y reanudar al salir
    let wasMusicPlayingBeforeStory = false;
    stories.setAudioCallbacks({
      onOpen: () => {
        if (audioPlayer && isMusicPlaying) {
          wasMusicPlayingBeforeStory = true;
          audioPlayer.pause();
          isMusicPlaying = false;
          musicToggleBtn.classList.remove('playing');
          musicLabel.textContent = 'Música';
        } else {
          wasMusicPlayingBeforeStory = false;
        }
      },
      onClose: () => {
        if (audioPlayer && wasMusicPlayingBeforeStory) {
          audioPlayer.play().then(() => {
            isMusicPlaying = true;
            musicToggleBtn.classList.add('playing');
            musicLabel.textContent = 'Pausar';
          }).catch(() => {});
          wasMusicPlayingBeforeStory = false;
        }
      }
    });
  } else if (musicToggleBtn) {
    musicToggleBtn.style.display = 'none';
  }

  // 1. RENDERIZAR HERO Y TEXTOS PRINCIPALES
  if (config.pareja) {
    if (brandMonogram) {
      brandMonogram.innerHTML = `
        <span class="brand-full">${config.pareja.novia} <span>&</span> ${config.pareja.novio}</span>
        <span class="brand-short">${config.pareja.monograma || 'V & J'}</span>
      `;
    }
    if (heroTagline) {
      heroTagline.textContent = config.pareja.subtituloHero || 'Nuestra Historia';
    }
    if (heroTitle) {
      heroTitle.innerHTML = `${config.pareja.novia} <em>& ${config.pareja.novio}</em>`;
    }
    if (heroDescription) {
      heroDescription.textContent = config.pareja.fraseBienvenida || '';
    }
    if (heroArtCard && config.pareja.fotoPortadaHero) {
      heroArtCard.innerHTML = `<img src="${config.pareja.fotoPortadaHero}" alt="${config.pareja.novia} y ${config.pareja.novio}" loading="eager" />`;
    }
    if (heroBadgeDate) {
      heroBadgeDate.textContent = config.pareja.fechaTexto || '';
    }
    if (heroBadgeLocation) {
      heroBadgeLocation.textContent = config.pareja.lugar || 'Nuestra Boda';
    }
  }

  // Botón para abrir el visor Stories / Reel
  if (btnOpenStories) {
    btnOpenStories.addEventListener('click', () => {
      stories.open(0);
    });
  }

  // 2. RENDERIZAR LÍNEA DE TIEMPO (TIMELINE)
  if (timelineContainer && config.historia) {
    timelineContainer.innerHTML = '';
    config.historia.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'timeline-item';

      const isVideo = item.tipo === 'video';
      const previewImg = isVideo ? (item.previewUrl || item.mediaUrl) : item.mediaUrl;

      el.innerHTML = `
        <div class="timeline-node"></div>
        <article class="timeline-card" data-index="${index}">
          <div class="timeline-meta">
            <span class="timeline-year">${item.año}</span>
            <span class="timeline-tag">${item.etapa || `Capítulo 0${index + 1}`}</span>
          </div>
          <div class="timeline-media">
            <img src="${previewImg}" alt="${item.titulo}" loading="lazy" />
            ${isVideo ? `
              <div class="video-badge-indicator">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>${item.duracion || 'Video'}</span>
              </div>
            ` : ''}
          </div>
          <h3 class="timeline-title">${item.titulo}</h3>
          <p class="timeline-subtitle">${item.subtitulo || ''}</p>
          <p class="timeline-desc">${item.descripcion}</p>
          <div class="timeline-action-hint">
            <span>${isVideo ? '▶ Reproducir momento' : '🔍 Ampliar recuerdo'}</span>
            <span>→</span>
          </div>
        </article>
      `;

      // Clic en tarjeta de timeline abre el modal lightbox
      const card = el.querySelector('.timeline-card');
      card.addEventListener('click', () => {
        lightbox.setItems(config.historia);
        lightbox.open(index);
      });

      timelineContainer.appendChild(el);
    });
  }

  // 3. RENDERIZAR GRID DE LA GALERÍA AUDIOVISUAL
  let currentFilter = 'todos';
  let filteredItems = [...(config.galeria || [])];

  function renderGallery(items) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      const isVideo = item.tipo === 'video';
      const previewImg = isVideo ? (item.previewUrl || item.mediaUrl) : item.mediaUrl;

      card.innerHTML = `
        <img class="gallery-thumb" src="${previewImg}" alt="${item.titulo}" loading="lazy" />
        ${isVideo ? `
          <div class="video-duration-badge">${item.duracion || 'Video'}</div>
          <div class="gallery-play-btn" title="Reproducir video">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        ` : ''}
        <div class="gallery-card-info">
          <h4 class="gallery-card-title">${item.titulo}</h4>
          <div class="gallery-card-sub">
            <span>${item.subtitulo || ''}</span>
            <span class="gallery-card-year">${item.año || ''}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        lightbox.setItems(items);
        lightbox.open(index);
      });

      galleryGrid.appendChild(card);
    });
  }

  // Render inicial de galería
  renderGallery(filteredItems);

  // Filtrado reactivo por categorías
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      currentFilter = cat;

      if (cat === 'todos') {
        filteredItems = [...config.galeria];
      } else if (cat === 'videos') {
        filteredItems = config.galeria.filter((it) => it.tipo === 'video');
      } else {
        filteredItems = config.galeria.filter((it) => it.categoria === cat);
      }

      renderGallery(filteredItems);
    });
  });

  // 4. RENDERIZAR PIE DE PÁGINA
  if (config.cierre) {
    if (footerMonogram && config.pareja) {
      footerMonogram.textContent = config.pareja.monograma || 'V & J';
    }
    if (footerQuote) {
      footerQuote.textContent = `“${config.cierre.mensajeFinal || 'Nos vemos en el altar'}”`;
    }
    if (footerSub) {
      footerSub.textContent = config.cierre.agradecimiento || '';
    }
    if (footerHashtag) {
      footerHashtag.textContent = config.cierre.hashtag || '';
    }
  }
});
