// ==============================
// BOTÕES PIX - COPIAR CHAVE
// ==============================

document.addEventListener ('DOMContentLoaded', () => {
  const botoesPix = document.querySelectorAll ('.btn-pix[data-chave]');

  botoesPix.forEach (botao => {
    botao.addEventListener ('click', () => {
      const chave = botao.getAttribute ('data-chave');
      copiarChave (chave, botao);
    });
  });
});

// ==============================
// FUNÇÃO DE CÓPIA
// ==============================
function copiarChave (valor, elemento) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test (navigator.userAgent);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText (valor)
      .then (() => feedback (elemento))
      .catch (() => manual (valor));
  } else {
    if (isMobile) {
      manual (valor);
    } else {
      fallback (valor);
      feedback (elemento);
    }
  }
}

function feedback (elemento) {
  const textoOriginal = elemento.innerHTML;
  elemento.innerHTML = '✓ COPIADO';
  elemento.classList.add ('sucesso');

  setTimeout (() => {
    elemento.innerHTML = textoOriginal;
    elemento.classList.remove ('sucesso');
  }, 2000);
}

function fallback (valor) {
  const tmp = document.createElement ('textarea');
  tmp.value = valor;
  tmp.style.position = 'fixed';
  tmp.style.opacity = '0';
  document.body.appendChild (tmp);
  tmp.select ();
  document.execCommand ('copy');
  document.body.removeChild (tmp);
}

function manual (valor) {
  prompt ('Copie a chave PIX:', valor);
}

function toggleMenu () {
  const menu = document.querySelector ('.menu-mobile');
  const overlay = document.querySelector ('.menu-overlay');

  // Liga/Desliga a classe 'ativo'
  menu.classList.toggle ('ativo');
  overlay.classList.toggle ('ativo');

  // Trava o scroll da página quando o menu estiver aberto
  if (menu.classList.contains ('ativo')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}
