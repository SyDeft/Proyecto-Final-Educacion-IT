export function inicializarSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const slides = document.querySelectorAll('.slide');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoplayInterval;
  const autoplayDelay = 5000;

  function goToSlide(index) {
    if (index >= slideCount) currentIndex = 0;
    else if (index < 0) currentIndex = slideCount - 1;
    else currentIndex = index;

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), autoplayDelay);
  }

  startAutoplay();

  nextArrow?.addEventListener('click', () => {
    clearInterval(autoplayInterval);
    goToSlide(currentIndex + 1);
    startAutoplay();
  });

  prevArrow?.addEventListener('click', () => {
    clearInterval(autoplayInterval);
    goToSlide(currentIndex - 1);
    startAutoplay();
  });

  slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  slider.addEventListener('mouseleave', startAutoplay);
}