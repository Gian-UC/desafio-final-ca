const btnTheme = document.querySelector('.btn-theme');

let theme =
  localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : 'light';

function applyTheme() {
  if (theme === 'dark') {
    body.style.setProperty('--background', 'rgb(27, 32, 40)');
    body.style.setProperty('--text-color', '#FFF');
    body.style.setProperty('--bg-secondary', '#2D3440');

    btnTheme.src = './assets/dark-mode.svg';
    btnPrev.src = './assets/arrow-left-light.svg';
    btnNext.src = './assets/arrow-right-light.svg';
    modalClose.src = './assets/close.svg';
  } else {
    body.style.setProperty('--background', '#FFF');
    body.style.setProperty('--text-color', 'rgb(27, 32, 40)');
    body.style.setProperty('--bg-secondary', '#EDEDED');

    btnTheme.src = './assets/light-mode.svg';
    btnPrev.src = './assets/arrow-left-dark.svg';
    btnNext.src = './assets/arrow-right-dark.svg';
    modalClose.src = './assets/close-dark.svg';
  }
}

btnTheme.addEventListener('click', () => {
  if (theme === 'light') {
    theme = 'dark';
  } else {
    theme = 'light';
  }

  localStorage.setItem('theme', theme);
  applyTheme();
});
