/**
 * ===================================================================
 * CONFIGURACIÓN DE LA GALERÍA AUDIOVISUAL & HISTORIA DE LOS NOVIOS
 * GaleryQR2 — Diseñado para escaneo de código QR en bodas
 * ===================================================================
 * Puedes personalizar todos los textos, fechas, fotos, videos y
 * enlaces de forma directa desde este archivo sin tocar el código HTML.
 */

window.GALLERY_CONFIG = {
  // 1. INFORMACIÓN PRINCIPAL DE LA PAREJA
  pareja: {
    novia: "Valeria",
    novio: "Josué",
    monograma: "V & J",
    tituloHero: "Valeria & Josué",
    subtituloHero: "NUESTRA HISTORIA · 2020 — 2026",
    fechaTexto: "Sábado, 21 de Noviembre de 2026",
    lugar: "Lima, Perú",
    fraseBienvenida: "Bienvenidos a nuestro rincón de recuerdos. Todo lo que nos trajo hasta aquí: las miradas iniciales, los viajes que marcaron nuestra vida y el gran paso que hoy celebramos ante Dios y con ustedes.",
    citaDestacada: "“Las mejores historias de amor no solo se viven... se guardan en el corazón y se celebran con quienes más amamos.”",
    fotoPortadaHero: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
  },

  // 2. MÚSICA AMBIENTAL DE FONDO
  musica: {
    habilitada: true,
    titulo: "A Thousand Years (Acoustic Guitar Melodic Loop)",
    // Enlace de audio MP3 para ambientar la experiencia (reproduce con el botón flotante)
    urlAudio: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3"
  },

  // 3. LÍNEA DE TIEMPO: NUESTRO CAMINO HASTA EL ALTAR
  // Cada hito representa una etapa clave del camino de los novios
  historia: [
    {
      año: "2020",
      etapa: "Capítulo 01",
      titulo: "El Primer Encuentro",
      subtitulo: "Una casualidad con propósito",
      descripcion: "Nos conocimos sin planearlo en un grupo de amigos. Aquella primera conversación de horas bastó para darnos cuenta de que nuestras risas y valores hablaban el mismo idioma.",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
      fechaDetalle: "Febrero 2020"
    },
    {
      año: "2022",
      etapa: "Capítulo 02",
      titulo: "Aventuras & Viajes Juntos",
      subtitulo: "Descubriendo que somos el mejor equipo",
      descripcion: "Entre viajes por la costa y la sierra, caminatas improvisadas y noches de café, aprendimos que el hogar no es una dirección física, sino estar juntos donde sea.",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop",
      fechaDetalle: "Julio 2022"
    },
    {
      año: "2024",
      etapa: "Capítulo 03",
      titulo: "El Gran '¡SÍ, ACEPTO!'",
      subtitulo: "La propuesta de matrimonio frente al mar",
      descripcion: "Con el sonido de las olas y el atardecer dorado, llegó la pregunta más soñada: '¿Quieres pasar el resto de tus días conmigo?'. Entre lágrimas de alegría y un abrazo eterno, dijimos sí al futuro juntos.",
      tipo: "video",
      // Video MP4 fluido reproducible directamente en lightbox
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-on-the-beach-at-sunset-41484-large.mp4",
      previewUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
      duracion: "0:30",
      fechaDetalle: "Diciembre 2024"
    },
    {
      año: "2026",
      etapa: "Capítulo 04",
      titulo: "Hacia el Altar",
      subtitulo: "El inicio de nuestra promesa eterna",
      descripcion: "Hoy reunimos a nuestras personas favoritas para dar gracias a Dios y celebrar el pacto de amor más importante de nuestras vidas. ¡Gracias por ser parte de nuestro viaje!",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
      fechaDetalle: "Noviembre 2026"
    }
  ],

  // 4. GALERÍA AUDIOVISUAL COMPLETA (FOTOS Y VIDEOS)
  // Categorías disponibles para filtrar: 'todos', 'comienzo', 'viajes', 'propuesta', 'videos'
  galeria: [
    {
      id: 1,
      titulo: "Nuestras Primeras Risas",
      categoria: "comienzo",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Donde empezó la magia",
      año: "2020",
      destacado: true
    },
    {
      id: 2,
      titulo: "Tarde Dorada",
      categoria: "viajes",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Escapada de fin de semana",
      año: "2021",
      destacado: false
    },
    {
      id: 3,
      titulo: "Clip: Nuestro Camino Juntos",
      categoria: "videos",
      tipo: "video",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-forest-41481-large.mp4",
      previewUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Mini película de nuestros paseos",
      año: "2022",
      duracion: "0:25",
      destacado: true
    },
    {
      id: 4,
      titulo: "Miradas que lo Dicen Todo",
      categoria: "comienzo",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Sesión previa en el campo",
      año: "2023",
      destacado: false
    },
    {
      id: 5,
      titulo: "Momentos Espontáneos",
      categoria: "viajes",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Risas sin filtro",
      año: "2023",
      destacado: false
    },
    {
      id: 6,
      titulo: "Clip: El Día de la Propuesta",
      categoria: "propuesta",
      tipo: "video",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-on-the-beach-at-sunset-41484-large.mp4",
      previewUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "El 'Sí' más feliz de nuestras vidas",
      año: "2024",
      duracion: "0:30",
      destacado: true
    },
    {
      id: 7,
      titulo: "Promesa de Amor",
      categoria: "propuesta",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "El anillo y la ilusión",
      año: "2024",
      destacado: false
    },
    {
      id: 8,
      titulo: "La Cuenta Regresiva",
      categoria: "comienzo",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Preparando cada detalle",
      año: "2025",
      destacado: false
    },
    {
      id: 9,
      titulo: "Clip: Te Elijo Cada Día",
      categoria: "videos",
      tipo: "video",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-couple-in-love-walking-together-in-nature-41485-large.mp4",
      previewUrl: "https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?q=80&w=1200&auto=format&fit=crop",
      subtitulo: "Nuestros votos resumidos en imágenes",
      año: "2026",
      duracion: "0:22",
      destacado: true
    }
  ],

  // 5. MODO "LOVE STORIES" (ESTILO REELS / TIKTOK STORIES)
  // Secuencia de historias automáticas con barra de progreso superior
  stories: [
    {
      titulo: "Como en una película",
      texto: "Así comenzó nuestra historia: dos vidas que cruzaron caminos y decidieron no soltarse jamás.",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
      duracionSegundos: 5
    },
    {
      titulo: "Aprender a caminar juntos",
      texto: "Cada viaje, cada risa y cada obstáculo nos confirmó que Dios tenía un propósito perfecto.",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop",
      duracionSegundos: 5
    },
    {
      titulo: "Un atardecer para la eternidad",
      texto: "El día en que una pregunta selló la decisión de amarnos por siempre.",
      tipo: "video",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-on-the-beach-at-sunset-41484-large.mp4",
      previewUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
      duracionSegundos: 10
    },
    {
      titulo: "Hoy es el día",
      texto: "Gracias por ser parte de nuestra historia y acompañarnos en este momento tan especial.",
      tipo: "foto",
      mediaUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
      duracionSegundos: 5
    }
  ],

  // 6. RINCÓN DE LOS INVITADOS & DINÁMICAS (Inspirado en TikTok @bodasconflow & @andrea_topeventos)
  rinconInvitados: {
    titulo: "¡Sé Parte de Nuestro Álbum!",
    bajada: "Queremos ver la boda a través de tus ojos. Sube todas las fotos y videos que tomes hoy, o déjanos tu dedicatoria.",
    // Enlace a donde los invitados pueden subir sus fotos (Google Drive, Dropbox, WedUploader o WhatsApp)
    enlaceSubirFotos: "https://photos.google.com/",
    enlaceWhatsApp: "https://wa.me/51999999999?text=¡Hola%20Valeria%20y%20Josué!%20Aquí%20les%20comparto%20nuestras%20fotos%20de%20su%20boda%20✨👰🤵",
    // Retos fotográficos inspirados en la tendencia de TikTok ("Juego del Espía / Retos de Mesa")
    retosFotograficos: [
      { reto: "Una selfie divertida con las personas de tu mesa", icono: "📸" },
      { reto: "El beso o mirada más tierna de los recién casados", icono: "💍" },
      { reto: "El momento más alegre o divertido en la pista de baile", icono: "💃" },
      { reto: "El mejor brindis levantando sus copas de celebración", icono: "🥂" }
    ],
    // Mensajes de felicitación precargados para el buzón interactivo
    mensajesEjemplo: [
      { autor: "Familia Mendoza Alarcón", mensaje: "¡Que Dios bendiga infinitamente este matrimonio! Los amamos con todo el corazón.", fecha: "Hoy" },
      { autor: "Claudia & Esteban", mensaje: "¡Qué emoción verlos llegar al altar tan felices y radiantes! Que nunca falte la alegría.", fecha: "Hoy" },
      { autor: "Amigos de la Promoción", mensaje: "¡Vivan los novios! A celebrar esta noche inolvidable.", fecha: "Hoy" }
    ],
    // Fotos iniciales de muestra para el Muro de Fotos en Vivo de los invitados
    fotosEnVivoIniciales: [
      {
        autor: "Claudia & Esteban - Mesa 2",
        fotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        comentario: "¡Felicidades a los novios más hermosos! 🎉💍",
        fecha: "Hace 10 min"
      },
      {
        autor: "Familia Alarcón - Mesa 5",
        fotoUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
        comentario: "¡La mejor boda del año! Brindando por ustedes 🥂",
        fecha: "Hace 20 min"
      },
      {
        autor: "Amigos de la Promoción",
        fotoUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
        comentario: "¡A romper la pista de baile esta noche! 💃🕺",
        fecha: "Hace 35 min"
      }
    ]
  },

  // 7. DESPEDIDA & PIE DE PÁGINA
  cierre: {
    mensajeFinal: "Nos vemos en el altar",
    agradecimiento: "Con todo nuestro amor y gratitud hacia cada uno de ustedes.",
    hashtag: "#BodaValeriayJosue2026"
  }
};
