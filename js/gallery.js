document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    const track = document.querySelector('.gallery-track');
    const arrowLeft = document.querySelector('.gallery-arrow-left');
    const arrowRight = document.querySelector('.gallery-arrow-right');
    
    // Obrázky
    const images = [
      {src: 'images/hutao-portrait.jpg', alt: 'Popis 1'},
      {src: 'images/hutao-fight.jpg', alt: 'Popis 2'},
      {src: 'images/hutao-portrait1.jpg', alt: 'Popis 3'},
      {src: 'images/hutao-portrait2.jpg', alt: 'Popis 4'},
      {src: 'images/hutao-portrait3.jpg', alt: 'Popis 5'},
      {src: 'images/hutao-portrait4.jpg', alt: 'Popis 6'},
      {src: 'images/hutao-portrait5.jpg', alt: 'Popis 7'},
      {src: 'images/hutao-portrait6.jpg', alt: 'Popis 8'}
    ];
    
    // Vytvoření duplicitních obrázků
    const duplicatedImages = [...images, ...images, ...images];
    
    // Vložení obrázků
    duplicatedImages.forEach((img, index) => {
      const imgElement = document.createElement('img');
      imgElement.src = img.src;
      imgElement.alt = img.alt;
      imgElement.dataset.index = index % images.length;
      imgElement.classList.add('gallery-img');
      track.appendChild(imgElement);
    });
    
    const itemWidth = 200 + 15;
    let currentPosition = -images.length * itemWidth;
    let isAnimating = false;
    track.style.transform = `translateX(${currentPosition}px)`;
    
    // automatické posouvání
    let autoScrollInterval;
    let isHovering = false;
    let manualScrollTimeout;
    const scrollDelay = 3000;
    
    function startAutoScroll() {
      if (!isHovering && !manualScrollTimeout) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
          if (!isAnimating) {
            scrollRight();
          }
        }, scrollDelay);
      }
    }
    
    // Doprava
    function scrollRight() {
      if (isAnimating) return;
      
      isAnimating = true;
      currentPosition -= itemWidth;
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(${currentPosition}px)`;
      
      setTimeout(() => {
        if (currentPosition <= -2 * images.length * itemWidth) {
          track.style.transition = 'none';
          currentPosition = -images.length * itemWidth;
          track.style.transform = `translateX(${currentPosition}px)`;
        }
        isAnimating = false;
      }, 500);
    }
    
    // Doleva
    function scrollLeft() {
      if (isAnimating) return;
      
      isAnimating = true;
      currentPosition += itemWidth;
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(${currentPosition}px)`;
      
      setTimeout(() => {
        if (currentPosition >= 0) {
          track.style.transition = 'none';
          currentPosition = -images.length * itemWidth;
          track.style.transform = `translateX(${currentPosition}px)`;
        }
        isAnimating = false;
      }, 500);
    }
    
    // Kliknutí na šipky
    function handleManualScroll(direction) {
      clearInterval(autoScrollInterval);
      clearTimeout(manualScrollTimeout);
      
      if (direction === 'left') {
        scrollLeft();
      } else {
        scrollRight();
      }
      
      manualScrollTimeout = setTimeout(() => {
        manualScrollTimeout = null;
        startAutoScroll();
      }, scrollDelay);
    }
    
    arrowLeft.addEventListener('click', () => handleManualScroll('left'));
    arrowRight.addEventListener('click', () => handleManualScroll('right'));
    
    // Automatického posouvání
    startAutoScroll();
    
    // Zastavení při najetí myší
    galleryContainer.addEventListener('mouseenter', () => {
      isHovering = true;
      clearInterval(autoScrollInterval);
      clearTimeout(manualScrollTimeout);
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      startAutoScroll();
    });
  
    // Lightbox funkce
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-arrow lightbox-arrow-left">&lt;</button>
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-image">
      </div>
      <button class="lightbox-arrow lightbox-arrow-right">&gt;</button>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxArrowLeft = lightbox.querySelector('.lightbox-arrow-left');
    const lightboxArrowRight = lightbox.querySelector('.lightbox-arrow-right');
    
    let currentImageIndex = 0;
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentImageIndex = parseInt(img.dataset.index);
        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        clearInterval(autoScrollInterval);
        clearTimeout(manualScrollTimeout);
      });
    });
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      startAutoScroll();
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Ovladani klavesnici
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    });
    
    function navigateLightbox(direction) {
      currentImageIndex += direction;
      
      if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
      } else if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
      }
      
      lightboxImg.src = images[currentImageIndex].src;
      lightboxImg.alt = images[currentImageIndex].alt;
    }
    
    // Ovladani sipkami
    lightboxArrowLeft.addEventListener('click', () => navigateLightbox(-1));
    lightboxArrowRight.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  });