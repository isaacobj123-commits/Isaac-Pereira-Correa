/* ============================================================
   Isaac Pereira Correa — Portfólio
   JavaScript: tema, hambúrguer, filtros, animações, formulário
   ============================================================ */

// ---- TEMA CLARO / ESCURO ----
// Recupera a preferência salva no localStorage (ou usa 'dark' como padrão)
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
})();

// Alterna entre dark e light ao clicar no botão
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next); // Salva a preferência
    updateThemeIcon(next);
  });
}

// Atualiza o ícone do botão conforme o tema
function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  // ☀ = sol (tema escuro ativo, clica pra clarear) | ☾ = lua (tema claro ativo, clica pra escurecer)
  icon.textContent = theme === 'dark' ? '☀' : '☾';
}


// ---- MENU HAMBÚRGUER (mobile) ----
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    // Muda as barras do hambúrguer quando aberto
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Fecha o menu ao clicar em qualquer link
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}


// ---- NAVBAR: adiciona sombra ao rolar ----
window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 20) {
    navbar.style.borderBottomColor = 'rgba(46,125,50,0.25)';
  } else {
    navbar.style.borderBottomColor = '';
  }
});


// ---- ANIMAÇÕES DE ENTRADA (Intersection Observer) ----
// Observa elementos com .timeline-content, .cert-card, .port-card, .stat, .exp-card
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      animObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Aplica efeito de fade-up a cartões e itens
document.querySelectorAll(
  '.timeline-content, .cert-card, .port-card, .stat, .exp-card, .contact-item, .about-text-col'
).forEach(function (el, i) {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  animObserver.observe(el);
});


// ---- SKILL BARS: anima largura quando visíveis ----
const barObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
  barObserver.observe(bar);
});


// ---- FILTRO DE PORTFÓLIO ----
const filterBtns = document.querySelectorAll('.filter-btn');
const portCards  = document.querySelectorAll('.port-card');

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // Remove classe ativa de todos e adiciona neste
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    portCards.forEach(function (card) {
      const cat = card.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        // Re-aplica animação
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(function () {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease, border-color 0.3s, box-shadow 0.3s, translate 0.3s';
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, 30);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


// ---- FORMULÁRIO DE CONTATO ----
// Chamado pelo onclick do botão na página contato.html
function enviarFormulario() {
  const nome     = document.getElementById('nome');
  const email    = document.getElementById('email');
  const mensagem = document.getElementById('mensagem');
  const nomeErr     = document.getElementById('nomeErr');
  const emailErr    = document.getElementById('emailErr');
  const mensagemErr = document.getElementById('mensagemErr');

  if (!nome) return; // Não está na página de contato

  let valido = true;

  // Limpa erros anteriores
  [nome, email, mensagem].forEach(f => f.classList.remove('error'));
  [nomeErr, emailErr, mensagemErr].forEach(e => e.textContent = '');

  // Valida nome: mínimo 3 caracteres
  if (nome.value.trim().length < 3) {
    nome.classList.add('error');
    nomeErr.textContent = 'Por favor, insira seu nome (mínimo 3 caracteres).';
    valido = false;
  }

  // Valida e-mail com expressão regular
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.classList.add('error');
    emailErr.textContent = 'Por favor, insira um e-mail válido (ex: usuario@dominio.com).';
    valido = false;
  }

  // Valida mensagem: mínimo 10 caracteres
  if (mensagem.value.trim().length < 10) {
    mensagem.classList.add('error');
    mensagemErr.textContent = 'Por favor, escreva uma mensagem (mínimo 10 caracteres).';
    valido = false;
  }

  if (!valido) return;

  // Preenche o modal com o nome digitado e exibe
  const modalNome = document.getElementById('modalNome');
  if (modalNome) {
    modalNome.textContent = nome.value.trim();
  }

  // Limpa os campos
  nome.value     = '';
  email.value    = '';
  mensagem.value = '';

  // Exibe o modal de sucesso
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.add('show');
}

// Fecha o modal
function fecharModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('show');
}

// Fecha o modal ao clicar fora da caixa
const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) fecharModal();
  });
}

// Fecha o modal ao pressionar Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') fecharModal();
});
