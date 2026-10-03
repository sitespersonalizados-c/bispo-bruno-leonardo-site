/* ==================================================
   1. FUNÇÃO PRINCIPAL
   ================================================== */
async function carregarPortal () {
  try {
    const resposta = await fetch ('dados.json');
    const dados = await resposta.json ();

    renderizarDestaques (dados.campanhas);
    renderizarEfata (dados.campanhas); // Renderiza a campanha do Efata separada

    renderizarArquivo (dados.arquivo_mensal);
    renderizarKids (dados.espaco_kids);
    renderizarVisitaProfeta (dados.visita_profeta);
    iniciarCarrosseis3D ();
    iniciarSwipers (); // Inicializa todos os Swipers da página
  } catch (erro) {
    console.error ('Erro ao carregar dados:', erro);
  }
}

/* ==================================================
   2. DESTAQUE (ROTINA DE ORAÇÕES)
   ================================================== */
function renderizarDestaques (dados) {
  const container = document.getElementById ('proposito-container');
  if (!container) return;

  // Filtrando apenas os itens que pertencem à Rotina de Orações (ex: índice 0, 8 e 9 baseados na sua lista)
  // Ou você pode ajustar o filtro de acordo com quais índices deseja mostrar aqui.
  const indicesRotina = [0, 8, 9]; 

  container.innerHTML = indicesRotina
    .map (index => {
      const item = dados[index];
      if (!item) return '';

      const classes = [
        'card-video-iluminados', // 0
        'card-video-oculto',     // 8
        'card-video-daniel'      // 9
      ];
      const classe = classes[indicesRotina.indexOf(index)] || 'card-video-iluminados';

      const temLink = item.link_playlist && item.link_playlist.trim () !== '';
      const acaoClique = temLink
        ? `window.open('${item.link_playlist}', '_blank')`
        : `alert('A playlist da ${item.titulo} estará disponível em breve!')`;
      const classeStatus = temLink ? '' : 'card-em-breve';

      return `
        <div class="swiper-slide ${classe} ${classeStatus}" onclick="${acaoClique}">
          <i class="fas ${item.icone}"></i>
          <h3>${item.titulo}</h3>
          <p><strong>${item.fase_1}</strong></p>
          <p>${item.descricao}</p>
          <span class="btn-acessar">${temLink ? 'Assistir Playlist' : 'Em Breve'}</span>
        </div>
      `;
    })
    .join ('');
}

/* ==================================================
   2.1. CAMPANHA DO EFATA
   ================================================== */
function renderizarEfata (dados) {
  const container = document.getElementById ('efata-container');
  if (!container) return;

  // Pegando os itens do Efata (do índice 1 ao 7)
  const indicesEfata = [1, 2, 3, 4, 5, 6, 7];

  container.innerHTML = indicesEfata
    .map (index => {
      const item = dados[index];
      if (!item) return '';

      const classe = index === 1 ? 'card-video-efata' : 'card-video-efata2';

      const temLink = item.link_playlist && item.link_playlist.trim () !== '';
      const acaoClique = temLink
        ? `window.open('${item.link_playlist}', '_blank')`
        : `alert('A playlist da ${item.titulo} estará disponível em breve!')`;
      const classeStatus = temLink ? '' : 'card-em-breve';

      return `
        <div class="swiper-slide ${classe} ${classeStatus}" onclick="${acaoClique}">
          <i class="fas ${item.icone}"></i>
          <h3>${item.titulo}</h3>
          <p><strong>${item.fase_1}</strong></p>
          <p>${item.descricao}</p>
          <span class="btn-acessar">${temLink ? 'Assistir Playlist' : 'Em Breve'}</span>
        </div>
      `;
    })
    .join ('');
}

/* ==================================================
   3. ARQUIVO DE ORAÇÕES
   ================================================== */
function renderizarArquivo (arquivo) {
  preencherCarrossel (
    'oracoes-dia',
    arquivo.oracoes_dia,
    'Oração do Dia',
    'fa-sun'
  );
  preencherCarrossel (
    'oracoes-noite',
    arquivo.oracoes_18h,
    'Oração da Noite (18h)',
    'fa-moon'
  );
  preencherCarrossel (
    'oracoes-meia-noite',
    arquivo.meia_noite,
    'Oração da Meia-Noite',
    'fa-star'
  );
}

function preencherCarrossel (id, lista, titulo, icone) {
  const container = document.getElementById (id);
  if (!container || !lista) return;

  container.innerHTML = lista
    .map (item =>
      criarCardPlaylist (titulo, item.mes, item.link_playlist, icone)
    )
    .join ('');
}

/* ==================================================
   4. KIDS
   ================================================== */
function renderizarKids (kids) {
  const container = document.getElementById ('kids-container');
  if (!container) return;

  container.innerHTML = `
    <div class="card-video-link">
      <div class="video-info">
        <i class="fas fa-child" style="color:${kids.cor_tema}; font-size: 50px;"></i>
        <h3 style="color:${kids.cor_tema}; margin: 15px 0;">${kids.titulo}</h3>
        <p style="color: white; margin-bottom: 20px;">
          Desenhos e histórias para crianças
        </p>
        <a href="${kids.link_playlist}" target="_blank"
            class="btn-acessar btn-kids-dynamic"
            style="--cor-kids: ${kids.cor_tema}">
            VER DESENHOS
        </a>
      </div>
    </div>
  `;
}

/* ==================================================
   4.1 VISITA DO PROFETA
   ================================================== */
function renderizarVisitaProfeta (visita) {
  const container = document.getElementById ('visita-profeta-container');
  if (!container || !visita) return;

  container.innerHTML = `
    <div class="card-video-link">
      <div class="video-info">
        <i class="fas fa-cross" style="color:${visita.cor_tema}; font-size: 50px;"></i>
        <h3 style="color:${visita.cor_tema}; margin: 15px 0;">${visita.titulo}</h3>
        <p style="color: white; margin-bottom: 20px;">
          Momentos especiais da visita do profeta
        </p>
        <a href="${visita.link_playlist}" target="_blank"
            class="btn-acessar btn-kids-dynamic"
            style="--cor-kids: ${visita.cor_tema}">
            VER VISITA
        </a>
      </div>
    </div>
  `;
}

/* ==================================================
   5. CARD PADRÃO
   ================================================== */
function criarCardPlaylist (tipo, mes, link, icone) {
  return `
        <div class="card-video">
            <div class="video-info">
                <i class="fas ${icone}"></i>
                <h4>${tipo}</h4>
                <p>${mes}</p>
                <a href="${link}" target="_blank" class="btn-acessar">Abrir Playlist</a>
            </div>
        </div>
    `;
}

/* ==================================================
   6. LÓGICA DO CARROSSEL 3D
   ================================================== */
function criarCarrossel3D (cards) {
  let index = 0;

  function atualizar () {
    cards.forEach ((card, i) => {
      card.classList.remove (
        'card-ativo',
        'card-esquerda',
        'card-direita',
        'card-oculto'
      );

      if (i === index) {
        card.classList.add ('card-ativo');
      } else if (i === index - 1 || (index === 0 && i === cards.length - 1)) {
        card.classList.add ('card-esquerda');
      } else if (i === index + 1 || (index === cards.length - 1 && i === 0)) {
        card.classList.add ('card-direita');
      } else {
        card.classList.add ('card-oculto');
      }
    });
  }

  atualizar ();

  return {
    next () {
      index = (index + 1) % cards.length;
      atualizar ();
    },
    prev () {
      index = (index - 1 + cards.length) % cards.length;
      atualizar ();
    },
  };
}

/* ==================================================
   7. INICIALIZA CARROSSEL 3D
   ================================================== */
function iniciarCarrosseis3D () {
  document.querySelectorAll ('.carrossel-3d').forEach (carrossel => {
    const containerInterno = carrossel.querySelector ('div');
    if (!containerInterno) return;

    const cards = Array.from (containerInterno.children);
    if (cards.length === 0) return;

    const viewport = document.createElement ('div');
    viewport.className = 'carrossel-viewport';
    viewport.id = containerInterno.id;

    cards.forEach (card => viewport.appendChild (card));
    containerInterno.replaceWith (viewport);

    const controle = criarCarrossel3D (cards);

    const btnPrev = carrossel.querySelector ('.prev');
    const btnNext = carrossel.querySelector ('.next');

    if (btnPrev) btnPrev.onclick = controle.prev;
    if (btnNext) btnNext.onclick = controle.next;
  });
}

let swipersInstances = []; // Armazena instâncias globais

function iniciarSwipers () {
  // Destrói instâncias anteriores se houverem
  swipersInstances.forEach (s => {
    if (s && typeof s.destroy === 'function') {
      s.destroy (true, true);
    }
  });
  swipersInstances = [];

  // Inicializa cada carrossel Swiper separadamente
  ['.rotinasSwiper', '.efataSwiper'].forEach (seletor => {
    const container = document.querySelector (seletor);
    if (!container) return;

    const slides = container.querySelectorAll ('.swiper-slide');
    const slideCount = slides.length;
    if (slideCount === 0) return;

    const isMobile = window.innerWidth < 768;
    const isLandscape = window.innerHeight <= 500;
    const slidesPerView = isMobile ? 'auto' : Math.min (3, slideCount);

    const swiperInstance = new Swiper (seletor, {
      slidesPerView,
      spaceBetween: 20,
      centeredSlides: isMobile,
      loop: (isMobile || isLandscape) && slideCount > 1,
      speed: 600,
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: slideCount > 1,
      watchOverflow: true,
      observer: true,
      observeParents: true,

      navigation: slideCount > 1
        ? {
            nextEl: container.parentElement.querySelector ('.swiper-button-next'),
            prevEl: container.parentElement.querySelector ('.swiper-button-prev'),
          }
        : false,

      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
      },

      keyboard: {
        enabled: true,
      },
    });

    swipersInstances.push (swiperInstance);
  });

  requestAnimationFrame (() => {
    swipersInstances.forEach (s => {
      if (s && typeof s.update === 'function') {
        s.update ();
      }
    });
  });
}

let resizeTimeout;

window.addEventListener ('resize', () => {
  clearTimeout (resizeTimeout);

  resizeTimeout = setTimeout (() => {
    iniciarSwipers ();
  }, 300);
});

/* ==================================================
   8. START
   ================================================== */
carregarPortal ();
