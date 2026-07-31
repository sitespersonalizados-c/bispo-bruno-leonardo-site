/* ==================================================
   1. FUNÇÃO PRINCIPAL
   ================================================== */
async function carregarPortal () {
  try {
    const resposta = await fetch ('dados.json');
    const dados = await resposta.json ();

    // Passamos o array de campanhas para a função
    renderizarDestaques (dados.campanhas);

    renderizarArquivo (dados.arquivo_mensal);
    renderizarKids (dados.espaco_kids);
    renderizarVisitaProfeta (dados.visita_profeta);
    iniciarCarrosseis3D ();
    iniciarSwiper ();
  } catch (erro) {
    console.error ('Erro ao carregar dados:', erro);
  }
}

/* ==================================================
   2. DESTAQUE (VERSÃO COM BLOQUEIO DE LINK VAZIO)
   ================================================== */
function renderizarDestaques (dados) {
  const container = document.getElementById ('proposito-container');
  if (!container) return;

  container.innerHTML = dados
    .map ((item, index) => {
      let classe = ''card-video-iluminados';

      if (index === 0) {
         classe = 'card-video-iluminados';
      } else if (index === 1) {
         classe = 'card-video-efata';
      } else if (index >= 2 && index <= 6){
         classe = 'card-video-efata2';
      } else if (index === 7){
         classe = 'card-video-oculto';
      } else if (index === 8) {
         classe = 'card-video-daniel';
      }
      else classe = 'card-video-iluminados';

      // 1. Verificamos se o link está vazio
      const temLink = item.link_playlist && item.link_playlist.trim () !== '';

      // 2. Definimos a ação do clique
      // Se tiver link, abre o link. Se não, dispara o alerta.
      const acaoClique = temLink
        ? `window.open('${item.link_playlist}', '_blank')`
        : `alert('A playlist da ${item.titulo} estará disponível em breve!')`;

      // 3. Adicionamos uma classe extra visual se estiver em breve
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

    // CORREÇÃO: Mantém o ID original para que o CSS continue funcionando
    viewport.id = containerInterno.id;

    cards.forEach (card => viewport.appendChild (card));
    containerInterno.replaceWith (viewport);

    const controle = criarCarrossel3D (cards);

    const btnPrev = carrossel.querySelector ('.prev');
    const btnNext = carrossel.querySelector ('.next');

    if (btnPrev) btnPrev.onclick = controle.prev;
    if (btnNext) btnNext.onclick = controle.next;

    btnPrev.onclick = controle.prev;
    btnNext.onclick = controle.next;
  });
}

let swiper; // global

function iniciarSwiper () {
  // Se já existir, destrói antes de recriar.
  if (swiper) {
    swiper.destroy (true, true);
    swiper = null;
  }

  const container = document.querySelector ('.rotinasSwiper');
  if (!container) {
    console.warn ('Swiper: contêiner não encontrado');
    return;
  }

  const slides = container.querySelectorAll ('.swiper-slide');
  const slideCount = slides.length;
  if (slideCount === 0) {
    console.warn ('Swiper: nenhum slide encontrado');
    return;
  }

  const isMobile = window.innerWidth < 768;
  const isLandscape = window.innerHeight <= 500;
  const slidesPerView = isMobile ? 'auto' : Math.min (3, slideCount);

  swiper = new Swiper ('.rotinasSwiper', {
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
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
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

  console.log ('Swiper OK', {
    mobile: isMobile,
    landscape: isLandscape,
    loop: swiper.params.loop,
    slides: slideCount,
    slidesPerView: swiper.params.slidesPerView,
    navigation: !!swiper.params.navigation,
  });

  // Força recalcular caso o layout ainda esteja estabilizando (ex: fontes ou imagens carregando)
  requestAnimationFrame (() => {
    if (swiper && typeof swiper.update === 'function') {
      swiper.update ();
    }
  });
}

let resizeTimeout;

window.addEventListener ('resize', () => {
  clearTimeout (resizeTimeout);

  resizeTimeout = setTimeout (() => {
    iniciarSwiper ();
  }, 300);
});

/* ==================================================
   8. START
   ================================================== */

carregarPortal ();
