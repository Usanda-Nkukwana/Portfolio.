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
});
