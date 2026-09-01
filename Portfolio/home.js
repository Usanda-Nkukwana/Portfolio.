document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.feature-card, .project-card, .stat-card, .profile-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });

  const counters = document.querySelectorAll('.stat-card strong');

  counters.forEach((counter) => {
    const originalText = counter.textContent.trim();
    const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
    const suffix = originalText.replace(/[0-9.]/g, '');

    if (!Number.isFinite(numericValue)) {
      return;
    }

    let startTime = null;
    const duration = 1200;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = numericValue * progress;
      counter.textContent = `${Math.round(currentValue)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        counter.textContent = originalText;
      }
    };

    window.requestAnimationFrame(tick);
  });
});
