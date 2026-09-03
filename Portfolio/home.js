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

  const slideshow = document.querySelector('.slideshow');
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const previousButton = document.querySelector('.slideshow-control.previous');
  const nextButton = document.querySelector('.slideshow-control.next');
  let currentSlide = 0;
  let slideshowTimer;

  const showSlide = (slideIndex) => {
    currentSlide = (slideIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === currentSlide);
    });

    indicators.forEach((indicator, index) => {
      const isActive = index === currentSlide;
      indicator.classList.toggle('is-active', isActive);
      indicator.toggleAttribute('aria-current', isActive);
    });
  };

  const startSlideshow = () => {
    window.clearInterval(slideshowTimer);
    slideshowTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
  };

  previousButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startSlideshow();
  });

  nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startSlideshow();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      startSlideshow();
    });
  });

  slideshow.addEventListener('mouseenter', () => window.clearInterval(slideshowTimer));
  slideshow.addEventListener('mouseleave', startSlideshow);
  slideshow.addEventListener('focusin', () => window.clearInterval(slideshowTimer));
  slideshow.addEventListener('focusout', (event) => {
    if (!slideshow.contains(event.relatedTarget)) startSlideshow();
  });
  startSlideshow();
});
