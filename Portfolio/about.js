document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.content-card, .timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach((section, index) => {
    section.classList.add('reveal');
    section.style.transitionDelay = `${index * 100}ms`;
    observer.observe(section);
  });
});
