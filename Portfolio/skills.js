document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('.tech-list span');

  chips.forEach((chip) => {
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-pressed', 'false');

    const toggleChip = () => {
      const isSelected = chip.classList.toggle('selected');
      chip.setAttribute('aria-pressed', String(isSelected));
    };

    chip.addEventListener('click', toggleChip);
    chip.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleChip();
      }
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  const closeMenu = () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
});
