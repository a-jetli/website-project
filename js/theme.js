const toggleBtn = document.getElementById('theme-toggle');
const menu = document.getElementById('theme-menu');
const submenu = document.getElementById('theme-submenu');
const customTrigger = document.getElementById('custom-trigger');
const customPrompt = document.getElementById('custom-prompt');
const customApply = document.getElementById('custom-apply');
const customClose = document.getElementById('custom-close');

function applyCustomColors() {
  const customVars = ['--bg', '--bg-subtle', '--text', '--text-muted', '--accent', '--border'];
  customVars.forEach(varName => {
    const saved = localStorage.getItem('custom' + varName);
    if (saved) {
      document.documentElement.style.setProperty(varName, saved);
    }
  });
}


function setTheme(theme) {
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  if (theme === 'custom') {
    applyCustomColors();
  } else {
    const customVars = ['--bg', '--bg-subtle', '--text', '--text-muted', '--accent', '--border'];
    customVars.forEach(varName => {
      document.documentElement.style.removeProperty(varName);
    });
  }
  menu.querySelectorAll('button[data-theme]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  menu.classList.remove('open');
  submenu.classList.remove('open');
}

const saved = localStorage.getItem('theme') || 'dark';
setTheme(saved);

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.classList.toggle('open');
});

menu.querySelector('.has-submenu').addEventListener('mouseenter', () => {
  submenu.classList.add('open');
});

menu.querySelector('.theme-submenu-wrapper').addEventListener('mouseleave', () => {
  submenu.classList.remove('open');
});

menu.querySelectorAll('button[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

if (customTrigger && customPrompt && customApply && customClose) {
  customTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => {
      customPrompt.classList.add('open');
    }, 0);
    menu.classList.remove('open');
  });

  customApply.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 'custom');
    localStorage.setItem('theme', 'custom');
    customPrompt.querySelectorAll('input[type="color"]').forEach(input => {
      document.documentElement.style.setProperty(input.dataset.var, input.value);
      localStorage.setItem('custom' + input.dataset.var, input.value);
    });
    customPrompt.classList.remove('open');
  });

  customClose.addEventListener('click', () => customPrompt.classList.remove('open'));
}

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && e.target !== toggleBtn) {
    menu.classList.remove('open');
    submenu.classList.remove('open');
  }
  if (customPrompt && !customPrompt.contains(e.target) && e.target !== customTrigger) {
    customPrompt.classList.remove('open');
  }
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#')) {
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    }
  });
});