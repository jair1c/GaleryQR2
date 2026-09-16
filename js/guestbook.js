/**
 * ===================================================================
 * GUESTBOOK & INTERACTIVE ALBUM - GaleryQR2
 * - Juego del Espía interactivo con cámara directa del smartphone
 * - Generador automático de Marcos Polaroid personalizados
 * - Muro de Fotos de Invitados en Vivo (Live Wedding Wall)
 * - Muro de dedicatorias y animaciones de confeti y corazones
 * ===================================================================
 */

class GuestAlbumManager {
  constructor() {
    this.config = null;
    this.storageKeyWishes = 'galeryqr2_guest_wishes';
    this.storageKeyChallenges = 'galeryqr2_completed_challenges';
    this.storageKeyLiveWall = 'galeryqr2_live_wall_photos';

    // Elementos Retos & Espía
    this.challengesContainer = document.getElementById('challengesList');
    this.progressBarFill = document.getElementById('spyProgressFill');
    this.progressCounter = document.getElementById('spyProgressCounter');
    this.cameraInput = document.getElementById('spyCameraInput');
    this.activeChallengeIndex = null;

    // Elementos Muro en Vivo
    this.liveWallGrid = document.getElementById('liveWallGrid');
    this.btnOpenUploadModal = document.getElementById('btnOpenUploadModal');
    this.uploadModal = document.getElementById('uploadPhotoModal');
    this.uploadModalClose = document.getElementById('uploadModalClose');
    this.uploadFileInput = document.getElementById('uploadFileInput');
    this.uploadPreviewBox = document.getElementById('uploadPreviewBox');
    this.uploadPreviewImg = document.getElementById('uploadPreviewImg');
    this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
    this.uploadForm = document.getElementById('uploadLivePhotoForm');
    this.uploadAuthorInput = document.getElementById('uploadAuthor');
    this.uploadCaptionInput = document.getElementById('uploadCaption');
    this.tempUploadedDataUrl = null;

    // Elementos Dedicatorias
    this.wishForm = document.getElementById('guestbookForm');
    this.wishesStream = document.getElementById('wishesStream');
    this.authorInput = document.getElementById('wishAuthor');
    this.messageInput = document.getElementById('wishMessage');

    // Botones externos
    this.uploadBtn = document.getElementById('btnUploadPhotos');
    this.whatsappBtn = document.getElementById('btnWhatsappPhotos');

    // Canvas oculto para polaroids
    this.polaroidCanvas = document.getElementById('polaroidCanvas');

    // Elementos del Modal de Inspección y Filtro del Espía
    this.verifyModal = document.getElementById('verifyChallengeModal');
    this.verifyTitle = document.getElementById('verifyChallengeTitle');
    this.verifyImg = document.getElementById('verifyPreviewImg');
    this.verifyChecklist = document.getElementById('verifyChecklist');
    this.verifyVerdictBox = document.getElementById('verifyVerdictBox');
    this.btnConfirmChallenge = document.getElementById('btnConfirmChallenge');
    this.btnRetakeChallenge = document.getElementById('btnRetakeChallenge');
    this.pendingChallengeData = null;
  }

  init(config) {
    this.config = config;
    if (!config?.rinconInvitados) return;

    // Configurar enlaces externos
    if (this.uploadBtn && config.rinconInvitados.enlaceSubirFotos) {
      this.uploadBtn.href = config.rinconInvitados.enlaceSubirFotos;
    }
    if (this.whatsappBtn && config.rinconInvitados.enlaceWhatsApp) {
      this.whatsappBtn.href = config.rinconInvitados.enlaceWhatsApp;
    }

    // Inicializar secciones
    this.initSpyGame(config.rinconInvitados.retosFotograficos);
    this.initLiveWall(config.rinconInvitados.fotosEnVivoIniciales);
    this.initGuestbook(config.rinconInvitados.mensajesEjemplo);
    this.initUploadModal();
    this.initVerificationModal();
  }

  /* ===================================================================
     1. JUEGO DEL ESPÍA (RETOS FOTOGRÁFICOS INTERACTIVOS)
     =================================================================== */
  initSpyGame(challenges) {
    if (!this.challengesContainer || !challenges) return;

    // Cargar retos completados de localStorage
    const savedProgress = this.getSavedChallenges();

    this.renderChallenges(challenges, savedProgress);
    this.updateProgress(savedProgress.length, challenges.length);

    // Evento de captura de cámara
    if (this.cameraInput) {
      this.cameraInput.addEventListener('change', (e) => this.handleCameraCapture(e));
    }
  }

  initVerificationModal() {
    if (this.btnConfirmChallenge) {
      this.btnConfirmChallenge.addEventListener('click', () => {
        if (this.pendingChallengeData) {
          this.saveChallengeCompletion(this.pendingChallengeData.index, this.pendingChallengeData.dataUrl);
          this.closeVerificationModal();
        }
      });
    }

    if (this.btnRetakeChallenge) {
      this.btnRetakeChallenge.addEventListener('click', () => {
        const prevIndex = this.pendingChallengeData ? this.pendingChallengeData.index : this.activeChallengeIndex;
        this.closeVerificationModal();
        this.activeChallengeIndex = prevIndex;
        if (this.cameraInput) {
          this.cameraInput.click();
        }
      });
    }

    if (this.verifyModal) {
      this.verifyModal.addEventListener('click', (e) => {
        if (e.target === this.verifyModal) {
          this.closeVerificationModal();
        }
      });
    }
  }

  closeVerificationModal() {
    if (this.verifyModal) {
      this.verifyModal.classList.remove('active', 'scanning');
      document.body.style.overflow = '';
      this.pendingChallengeData = null;
    }
  }

  getSavedChallenges() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKeyChallenges)) || [];
    } catch (e) {
      return [];
    }
  }

  renderChallenges(challenges, completedList) {
    this.challengesContainer.innerHTML = '';

    challenges.forEach((item, index) => {
      const isCompleted = completedList.some(c => c.index === index);
      const savedData = completedList.find(c => c.index === index);

      const card = document.createElement('div');
      card.className = `challenge-interactive-card ${isCompleted ? 'completed' : ''}`;
      card.id = `challenge-card-${index}`;

      card.innerHTML = `
        <div class="challenge-card-top">
          <div class="challenge-info-left">
            <div class="challenge-icon-badge">${item.icono || '📸'}</div>
            <div class="challenge-name">${item.reto}</div>
          </div>
          <span class="challenge-status-badge">${isCompleted ? '¡Cumplido! ✅' : 'Pendiente'}</span>
        </div>
        <div class="challenge-action-area">
          <button type="button" class="btn-trigger-camera" data-index="${index}">
            <span>${isCompleted ? '📸 Cambiar Foto' : '📸 Cumplir Reto'}</span>
          </button>
          <img class="challenge-preview-thumb" id="challenge-thumb-${index}" src="${savedData?.dataUrl || ''}" alt="Foto reto" />
          <button type="button" class="btn-download-polaroid" data-index="${index}">
            <span>🖼️ Descargar Polaroid</span>
          </button>
        </div>
      `;

      // Botón para abrir cámara
      const btnCamera = card.querySelector('.btn-trigger-camera');
      btnCamera.addEventListener('click', () => {
        this.activeChallengeIndex = index;
        if (this.cameraInput) this.cameraInput.click();
      });

      // Botón para descargar Polaroid
      const btnPolaroid = card.querySelector('.btn-download-polaroid');
      btnPolaroid.addEventListener('click', () => {
        const data = this.getSavedChallenges().find(c => c.index === index);
        if (data && data.dataUrl) {
          this.generatePolaroid(data.dataUrl, item.reto);
        }
      });

      // Clic en miniatura abre visor
      const thumb = card.querySelector('.challenge-preview-thumb');
      thumb.addEventListener('click', () => {
        const data = this.getSavedChallenges().find(c => c.index === index);
        if (data?.dataUrl && window.GalleryLightbox) {
          const lb = new window.GalleryLightbox();
          lb.setItems([{ tipo: 'foto', mediaUrl: data.dataUrl, titulo: item.reto, subtitulo: 'Reto del Espía cumplido' }]);
          lb.open(0);
        }
      });

      this.challengesContainer.appendChild(card);
    });
  }

  handleCameraCapture(e) {
    const file = e.target.files[0];
    if (!file || this.activeChallengeIndex === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      // Abrir modal de inspección y validación del espía
      this.openVerificationInspection(this.activeChallengeIndex, dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  }

  /* ===================================================================
     FILTROS Y VALIDACIÓN INTELIGENTE DE FOTOS DEL ESPÍA
     =================================================================== */
  async openVerificationInspection(index, dataUrl) {
    if (!this.verifyModal) {
      // Fallback directo si no existe el modal
      this.saveChallengeCompletion(index, dataUrl);
      return;
    }

    this.pendingChallengeData = { index, dataUrl };
    const retoObj = this.config.rinconInvitados.retosFotograficos[index];
    const retoTitulo = retoObj?.reto || 'Reto del Espía';

    if (this.verifyTitle) this.verifyTitle.textContent = retoTitulo;
    if (this.verifyImg) this.verifyImg.src = dataUrl;

    // Mostrar modal con animación de escaneo láser
    this.verifyModal.classList.add('active', 'scanning');
    document.body.style.overflow = 'hidden';

    if (this.verifyChecklist) {
      this.verifyChecklist.innerHTML = `
        <li class="verify-check-item">
          <span class="verify-check-icon">🔍</span>
          <span>Analizando iluminación, nitidez y presencia en la foto...</span>
        </li>
      `;
    }
    if (this.verifyVerdictBox) {
      this.verifyVerdictBox.className = 'verify-verdict-box';
      this.verifyVerdictBox.textContent = 'Inspeccionando foto...';
    }
    if (this.btnConfirmChallenge) {
      this.btnConfirmChallenge.disabled = true;
    }

    // Pequeño delay de 800ms para efecto cinematográfico de escaneo
    setTimeout(async () => {
      const analysis = await this.analyzePhoto(dataUrl, retoTitulo);
      this.verifyModal.classList.remove('scanning');
      this.renderInspectionResults(analysis);
    }, 850);
  }

  analyzePhoto(dataUrl, retoTitulo) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        // Renderizar a un canvas reducido de 320x240 para análisis veloz
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetW = 320;
        const targetH = Math.round(targetW * (img.height / img.width));
        canvas.width = targetW;
        canvas.height = targetH;
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const totalPixels = targetW * targetH;

        let totalLuminance = 0;
        let skinPixels = 0;
        let rTotal = 0, gTotal = 0, bTotal = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          rTotal += r;
          gTotal += g;
          bTotal += b;

          // Luminancia estándar
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;

          // Regla empírica de detección de tonos de piel humana en RGB
          if (r > 60 && g > 40 && b > 20 && (r - g) > 10 && r > b && (Math.max(r, g, b) - Math.min(r, g, b)) > 15) {
            skinPixels++;
          }
        }

        const avgLuminance = (totalLuminance / totalPixels) / 255;
        const skinRatio = skinPixels / totalPixels;

        // Varianza de color para descartar fotos completamente planas (pared o mesa vacía)
        const avgR = rTotal / totalPixels;
        const avgG = gTotal / totalPixels;
        const avgB = bTotal / totalPixels;
        let varianceSum = 0;
        // Muestra rápida cada 10 píxeles
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          varianceSum += Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB);
        }
        const colorVariance = varianceSum / (totalPixels / 10);

        // Detección de rostros nativa si el navegador la soporta
        let facesDetected = 0;
        if ('FaceDetector' in window) {
          try {
            const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
            const faces = await detector.detect(img);
            facesDetected = faces ? faces.length : 0;
          } catch (e) {}
        }

        // Evaluación de Criterios:
        // Criterio 1: Iluminación adecuada (no negra por lente tapado, no blanca pura)
        const isLightingGood = avgLuminance >= 0.12 && avgLuminance <= 0.94;

        // Criterio 2: No es una superficie plana vacía (mantel liso, piso)
        const isNotFlatSurface = colorVariance >= 14;

        // Criterio 3: Presencia humana (rostro detectado o tonos de piel > 3%)
        const hasHumanPresence = facesDetected > 0 || skinRatio >= 0.032;

        const checks = [
          {
            nombre: 'Iluminación y Claridad',
            passed: isLightingGood,
            detalle: isLightingGood
              ? 'Nivel de luz óptimo'
              : (avgLuminance < 0.12 ? 'Foto demasiado oscura o con el lente cubierto' : 'Foto sobreexpuesta en blanco')
          },
          {
            nombre: 'Composición y Escena',
            passed: isNotFlatSurface,
            detalle: isNotFlatSurface
              ? 'Escena con elementos y contraste'
              : 'Parece una superficie plana o vacía (mantel/piso)'
          },
          {
            nombre: 'Presencia Humana',
            passed: hasHumanPresence,
            detalle: hasHumanPresence
              ? (facesDetected > 0 ? `${facesDetected} rostro(s) detectado(s)` : 'Personas detectadas en la toma')
              : 'No se detectaron personas en la foto'
          }
        ];

        // Se aprueba si la iluminación y textura están bien, y hay personas presentes
        const overallPassed = isLightingGood && isNotFlatSurface && hasHumanPresence;

        resolve({
          passed: overallPassed,
          checks
        });
      };
      img.src = dataUrl;
    });
  }

  renderInspectionResults(analysis) {
    if (!this.verifyChecklist || !this.verifyVerdictBox) return;

    this.verifyChecklist.innerHTML = '';

    analysis.checks.forEach((chk) => {
      const li = document.createElement('li');
      li.className = `verify-check-item ${chk.passed ? 'passed' : 'failed'}`;
      li.innerHTML = `
        <span class="verify-check-icon">${chk.passed ? '✅' : '❌'}</span>
        <div>
          <strong>${chk.nombre}:</strong> ${chk.detalle}
        </div>
      `;
      this.verifyChecklist.appendChild(li);
    });

    if (analysis.passed) {
      this.verifyVerdictBox.className = 'verify-verdict-box approved';
      this.verifyVerdictBox.innerHTML = `<strong>🎯 ¡Misión Verificada con Éxito!</strong><br>La foto cumple con los requisitos del reto. Haz clic en "Cumplir Reto" para registrarla.`;
      if (this.btnConfirmChallenge) this.btnConfirmChallenge.disabled = false;
    } else {
      this.verifyVerdictBox.className = 'verify-verdict-box rejected';
      this.verifyVerdictBox.innerHTML = `<strong>⚠️ Foto Rechazada por el Espía</strong><br>No cumple los criterios marcados en rojo. Toma una foto donde salgan tus acompañantes con buena luz.`;
      if (this.btnConfirmChallenge) this.btnConfirmChallenge.disabled = true;
    }
  }

  saveChallengeCompletion(index, dataUrl) {
    let list = this.getSavedChallenges();
    list = list.filter(c => c.index !== index); // Reemplazar si existía
    list.push({ index, dataUrl, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

    try {
      localStorage.setItem(this.storageKeyChallenges, JSON.stringify(list));
    } catch (err) {
      console.warn('LocalStorage lleno, se mantiene en memoria', err);
    }

    // Actualizar visualmente la tarjeta
    const card = document.getElementById(`challenge-card-${index}`);
    if (card) {
      card.classList.add('completed');
      const badge = card.querySelector('.challenge-status-badge');
      if (badge) badge.textContent = '¡Cumplido! ✅';

      const thumb = document.getElementById(`challenge-thumb-${index}`);
      if (thumb) {
        thumb.src = dataUrl;
        thumb.style.display = 'block';
      }

      const btnCamera = card.querySelector('.btn-trigger-camera');
      if (btnCamera) btnCamera.querySelector('span').textContent = '📸 Cambiar Foto';
    }

    const total = this.config.rinconInvitados.retosFotograficos.length;
    this.updateProgress(list.length, total);

    // Disparar confeti
    this.triggerConfetti();

    // También agregar automáticamente esta foto al Muro en Vivo de la boda
    const challengeText = this.config.rinconInvitados.retosFotograficos[index]?.reto || 'Reto del Espía';
    this.addLiveWallPhoto({
      autor: 'Mesa de Invitados',
      fotoUrl: dataUrl,
      comentario: `🎯 Reto Cumplido: ${challengeText}`,
      fecha: 'Ahora mismo'
    });
  }

  updateProgress(completed, total) {
    if (this.progressBarFill) {
      const pct = Math.min(100, Math.round((completed / total) * 100));
      this.progressBarFill.style.width = `${pct}%`;
    }
    if (this.progressCounter) {
      this.progressCounter.textContent = `${completed} de ${total} retos`;
    }
  }

  /* ===================================================================
     2. GENERADOR DE MARCOS POLAROID PERSONALIZADOS
     =================================================================== */
  generatePolaroid(dataUrl, retoText) {
    if (!this.polaroidCanvas) return;
    const canvas = this.polaroidCanvas;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      // Dimensiones de Polaroid estándar (600 x 740 px)
      canvas.width = 600;
      canvas.height = 740;

      // Fondo blanco cremoso
      ctx.fillStyle = '#fbf9f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Foto recortada centrada (520 x 520 px)
      const photoX = 40;
      const photoY = 40;
      const photoSize = 520;

      // Mantener proporción de la imagen al recortar
      const aspect = img.width / img.height;
      let sx, sy, sWidth, sHeight;
      if (aspect > 1) {
        sHeight = img.height;
        sWidth = img.height;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = img.width;
        sHeight = img.width;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, photoX, photoY, photoSize, photoSize);

      // Marco interior sutil
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);

      // Textos del marco inferior
      ctx.textAlign = 'center';
      ctx.fillStyle = '#281a29';
      ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
      const nombres = `${this.config.pareja.novia} & ${this.config.pareja.novio}`;
      ctx.fillText(nombres, canvas.width / 2, 610);

      ctx.font = '14px "DM Mono", monospace';
      ctx.fillStyle = '#8e838e';
      const fecha = this.config.pareja.fechaTexto || '21 · Noviembre · 2026';
      ctx.fillText(fecha, canvas.width / 2, 640);

      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#b86b5a';
      ctx.fillText(`“${retoText}”`, canvas.width / 2, 675);

      // Descargar imagen
      const link = document.createElement('a');
      link.download = `polaroid-${nombres.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
    };
    img.src = dataUrl;
  }

  /* ===================================================================
     3. MURO DE FOTOS EN VIVO (LIVE WEDDING WALL)
     =================================================================== */
  initLiveWall(initialPhotos) {
    if (!this.liveWallGrid) return;

    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(this.storageKeyLiveWall)) || [];
    } catch (e) {
      saved = [];
    }

    // Combinar fotos locales con fotos iniciales de ejemplo
    const all = [...saved, ...(initialPhotos || [
      {
        autor: "Claudia & Esteban",
        fotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        comentario: "¡Felicidades a los novios más hermosos! 🎉💍",
        fecha: "Hace unos minutos"
      },
      {
        autor: "Mesa 3 - Familia Alarcón",
        fotoUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
        comentario: "¡La mejor boda de todas! Brindando por ustedes 🥂",
        fecha: "Hace 15 min"
      },
      {
        autor: "Amigos de la Promoción",
        fotoUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
        comentario: "¡A romper la pista de baile esta noche! 💃🕺",
        fecha: "Hace 30 min"
      }
    ])];

    this.renderLiveWall(all);
  }

  renderLiveWall(photos) {
    this.liveWallGrid.innerHTML = '';
    photos.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'live-wall-item';
      card.innerHTML = `
        <div class="live-wall-img-wrap">
          <img src="${item.fotoUrl}" alt="Foto de ${this.escapeHTML(item.autor)}" loading="lazy" />
        </div>
        <div class="live-wall-meta">
          <div class="live-wall-author">
            <span>${this.escapeHTML(item.autor)}</span>
            <span class="live-wall-time">${this.escapeHTML(item.fecha || 'Hoy')}</span>
          </div>
          <p class="live-wall-caption">${this.escapeHTML(item.comentario || '')}</p>
        </div>
      `;

      // Clic en la foto del muro abre Lightbox inmersivo
      const imgWrap = card.querySelector('.live-wall-img-wrap');
      imgWrap.addEventListener('click', () => {
        if (window.GalleryLightbox) {
          const lb = new window.GalleryLightbox();
          lb.setItems([{ tipo: 'foto', mediaUrl: item.fotoUrl, titulo: item.autor, subtitulo: item.comentario }]);
          lb.open(0);
        }
      });

      this.liveWallGrid.appendChild(card);
    });
  }

  addLiveWallPhoto(photoObj) {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(this.storageKeyLiveWall)) || [];
    } catch (e) {
      saved = [];
    }

    saved.unshift(photoObj);
    try {
      localStorage.setItem(this.storageKeyLiveWall, JSON.stringify(saved));
    } catch (e) {
      console.warn('Almacenamiento local lleno');
    }

    // Insertar arriba en el grid
    const card = document.createElement('div');
    card.className = 'live-wall-item';
    card.style.animation = 'fadeIn 0.6s ease';
    card.innerHTML = `
      <div class="live-wall-img-wrap">
        <img src="${photoObj.fotoUrl}" alt="Foto de ${this.escapeHTML(photoObj.autor)}" />
      </div>
      <div class="live-wall-meta">
        <div class="live-wall-author">
          <span>${this.escapeHTML(photoObj.autor)}</span>
          <span class="live-wall-time">${photoObj.fecha}</span>
        </div>
        <p class="live-wall-caption">${this.escapeHTML(photoObj.comentario || '')}</p>
      </div>
    `;

    card.querySelector('.live-wall-img-wrap').addEventListener('click', () => {
      if (window.GalleryLightbox) {
        const lb = new window.GalleryLightbox();
        lb.setItems([{ tipo: 'foto', mediaUrl: photoObj.fotoUrl, titulo: photoObj.autor, subtitulo: photoObj.comentario }]);
        lb.open(0);
      }
    });

    if (this.liveWallGrid.firstChild) {
      this.liveWallGrid.insertBefore(card, this.liveWallGrid.firstChild);
    } else {
      this.liveWallGrid.appendChild(card);
    }
  }

  /* ===================================================================
     4. MODAL DE SUBIDA MANUAL AL MURO EN VIVO
     =================================================================== */
  initUploadModal() {
    if (this.btnOpenUploadModal && this.uploadModal) {
      this.btnOpenUploadModal.addEventListener('click', () => {
        this.uploadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (this.uploadModalClose) {
      this.uploadModalClose.addEventListener('click', () => {
        this.closeUploadModal();
      });
    }

    if (this.uploadPreviewBox && this.uploadFileInput) {
      this.uploadPreviewBox.addEventListener('click', () => {
        this.uploadFileInput.click();
      });

      this.uploadFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.tempUploadedDataUrl = ev.target.result;
          this.uploadPreviewImg.src = this.tempUploadedDataUrl;
          this.uploadPreviewImg.style.display = 'block';
          this.uploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      });
    }

    if (this.uploadForm) {
      this.uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!this.tempUploadedDataUrl) {
          alert('Por favor selecciona o toma una foto primero');
          return;
        }

        const author = this.uploadAuthorInput.value.trim() || 'Invitado';
        const caption = this.uploadCaptionInput.value.trim() || '¡Vivan los novios!';

        this.addLiveWallPhoto({
          autor: author,
          fotoUrl: this.tempUploadedDataUrl,
          comentario: caption,
          fecha: 'Ahora mismo'
        });

        this.triggerConfetti();
        this.closeUploadModal();

        // Reset
        this.tempUploadedDataUrl = null;
        this.uploadPreviewImg.style.display = 'none';
        this.uploadPlaceholder.style.display = 'block';
        this.uploadForm.reset();
      });
    }
  }

  closeUploadModal() {
    if (this.uploadModal) {
      this.uploadModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ===================================================================
     5. DEDICATORIAS & CORAZONES
     =================================================================== */
  initGuestbook(defaultWishes) {
    if (!this.wishesStream) return;

    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(this.storageKeyWishes)) || [];
    } catch (e) {
      saved = [];
    }

    const allWishes = [...saved, ...(defaultWishes || [])];
    this.renderWishes(allWishes);

    if (this.wishForm) {
      this.wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = this.authorInput.value.trim();
        const message = this.messageInput.value.trim();
        if (!author || !message) return;

        const newWish = { autor: author, mensaje: message, fecha: 'Ahora mismo' };
        saved.unshift(newWish);
        try {
          localStorage.setItem(this.storageKeyWishes, JSON.stringify(saved));
        } catch (err) {}

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

        this.triggerConfetti();
        this.spawnFloatingHearts();
        this.wishForm.reset();
      });
    }
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

  /* ===================================================================
     EFECTOS: CONFETI & CORAZONES
     =================================================================== */
  triggerConfetti() {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#e2b77a', '#d38b80', '#f2dbd5', '#25d366', '#ffffff']
      });
    }
  }

  spawnFloatingHearts() {
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div');
      heart.textContent = ['❤️', '💖', '✨', '💍', '🥂'][Math.floor(Math.random() * 5)];
      heart.style.position = 'fixed';
      heart.style.left = `${Math.random() * 80 + 10}vw`;
      heart.style.bottom = '40px';
      heart.style.fontSize = `${Math.random() * 18 + 20}px`;
      heart.style.zIndex = '9999';
      heart.style.pointerEvents = 'none';
      heart.style.transition = 'all 2s ease-out';
      heart.style.opacity = '1';

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.transform = `translateY(-${Math.random() * 250 + 200}px) scale(1.4)`;
        heart.style.opacity = '0';
      }, 50);

      setTimeout(() => heart.remove(), 2100);
    }
  }

  escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str || '';
    return p.innerHTML;
  }
}

window.GuestAlbumManager = GuestAlbumManager;
