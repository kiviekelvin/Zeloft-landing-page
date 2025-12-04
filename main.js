// Hero Image Rotation
let currentIndex = 0;
const mediaWrappers = document.querySelectorAll('.hero-media-wrapper');
const totalImages = mediaWrappers.length;

function rotateHeroImages() {
  if (mediaWrappers.length > 0) {
    // Hide current
    mediaWrappers[currentIndex].classList.remove('active');

    // Next index
    currentIndex = (currentIndex + 1) % totalImages;

    // Show next
    mediaWrappers[currentIndex].classList.add('active');
  }
}

// Start rotation if images exist
if (mediaWrappers.length > 0) {
  setInterval(rotateHeroImages, 6000);
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeroVisibility();
  initStatCounters();
  initTestimonialsCarousel();
  initPracticeAreasCarousel(); // ADDED: Practice areas carousel
  initHeroParallax();
  initConsultationModal();
  initMobileMenu();
  initImageLoadHandling();
  initFormValidation();
});

// ADDED: Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  if (!mobileMenuBtn || !mainNav) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isActive = mainNav.classList.contains('active');
    
    if (isActive) {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    } else {
      mainNav.classList.add('active');
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }
  });

  // Close menu when clicking on a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });
}

// ADDED: Image loading skeleton handling
function initImageLoadHandling() {
  const images = document.querySelectorAll('.hero-media img');
  
  images.forEach(img => {
    if (img.complete) {
      hideSkeletonForImage(img);
    } else {
      img.addEventListener('load', () => {
        hideSkeletonForImage(img);
      });
    }
  });
}

function hideSkeletonForImage(img) {
  const skeleton = document.querySelector('.image-skeleton');
  if (skeleton && img.classList.contains('active') || img.parentElement.classList.contains('active')) {
    skeleton.style.display = 'none';
  }
}

// ADDED: Form validation with visual feedback
function initFormValidation() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });
}

function validateField(field) {
  const errorSpan = document.getElementById(`${field.id}-error`);
  if (!errorSpan) return;

  let isValid = true;
  let errorMessage = '';

  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (field.type === 'email' && field.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }

  if (!isValid) {
    field.classList.add('error');
    errorSpan.textContent = errorMessage;
  } else {
    field.classList.remove('error');
    errorSpan.textContent = '';
  }

  return isValid;
}

function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const modalClose = document.getElementById('modalClose');
  const consultationForm = document.getElementById('consultationForm');
  const successMessage = document.getElementById('successMessage');
  const closeSuccess = document.getElementById('closeSuccess');
  
  // Check if modal elements exist
  if (!modal) return;
  
  // UPDATED: Get all CTA buttons with the trigger class
  const ctaButtons = document.querySelectorAll('.cta-trigger');
  
  // Open modal on CTA click
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form after a delay
    setTimeout(() => {
      if (consultationForm) {
        consultationForm.reset();
        consultationForm.style.display = 'block';
        // ADDED: Clear validation errors
        const errorFields = consultationForm.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
        const errorMessages = consultationForm.querySelectorAll('.form-error');
        errorMessages.forEach(msg => msg.textContent = '');
      }
      if (successMessage) {
        successMessage.classList.remove('active');
      }
    }, 300);
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (closeSuccess) {
    closeSuccess.addEventListener('click', closeModal);
  }
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Handle form submission validation
  if (consultationForm) {
    consultationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // ADDED: Validate all required fields before submission
      const requiredFields = consultationForm.querySelectorAll('[required]');
      let isFormValid = true;
      
      requiredFields.forEach(field => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });
      
      if (!isFormValid) {
        return;
      }
      
      const submitButton = consultationForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      try {
        const formData = new FormData(consultationForm);
        const response = await fetch('/', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          // Show success message immediately without redirect
          consultationForm.style.display = 'none';
          if (successMessage) {
            successMessage.classList.add('active');
          }
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting the form. Please try again or email us directly at hello@xeloft.com');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }
}

function initHeroVisibility() {
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => {
      hero.classList.add('is-visible');
    }, 100);
  }
}

function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle sections with data-reveal
        if (entry.target.hasAttribute('data-reveal')) {
          entry.target.classList.add('is-visible');
        }

        // Handle individual animated elements
        if (entry.target.classList.contains('animate-on-scroll') || 
            entry.target.classList.contains('animate-fade-in')) {
          entry.target.classList.add('in-view');
        }

        // Handle stagger containers
        if (entry.target.classList.contains('stagger-container')) {
          const items = entry.target.querySelectorAll('.stagger-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('in-view');
            }, index * 120);
          });
        }

        // Animate stats when market-shift section is visible
        if (entry.target.classList.contains('market-shift')) {
          animateStats(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe sections with data-reveal
  document.querySelectorAll('[data-reveal]').forEach(section => {
    observer.observe(section);
  });

  // Observe individual animated elements
  document.querySelectorAll('.animate-on-scroll, .animate-fade-in, .stagger-container').forEach(el => {
    observer.observe(el);
  });
}

function animateStats(section) {
  const statValues = section.querySelectorAll('.stat-value');

  statValues.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 1000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOutProgress * target);
      stat.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

function initStatCounters() {
  // Stats are now handled by the scroll reveal
}

function initTestimonialsCarousel() {
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('[data-direction="prev"]');
  const nextBtn = document.querySelector('[data-direction="next"]');

  if (!testimonials.length) return;

  let currentIndex = 0;
  let autoplayInterval;
  let isPaused = false;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      if (i === index) {
        testimonial.classList.add('active');
      } else {
        testimonial.classList.remove('active');
      }
    });
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function startAutoplay() {
    if (!isPaused) {
      autoplayInterval = setInterval(nextTestimonial, 4000);
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevTestimonial();
      stopAutoplay();
      isPaused = true;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextTestimonial();
      stopAutoplay();
      isPaused = true;
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevTestimonial();
      stopAutoplay();
      isPaused = true;
    } else if (e.key === 'ArrowRight') {
      nextTestimonial();
      stopAutoplay();
      isPaused = true;
    }
  });

  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', () => {
      if (!isPaused) startAutoplay();
    });
  }

  startAutoplay();
}

// ADDED: Practice Areas Carousel functionality
function initPracticeAreasCarousel() {
  const areaCards = document.querySelectorAll('.area-card');
  const prevBtn = document.querySelector('[data-area-direction="prev"]');
  const nextBtn = document.querySelector('[data-area-direction="next"]');
  const track = document.querySelector('.areas-carousel-track');

  if (!areaCards.length || !track) return;

  let currentIndex = 0;
  const cardsToShow = getCardsToShow();

  function getCardsToShow() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  }

  function updateCarousel() {
    const cardWidth = areaCards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update active states
    areaCards.forEach((card, index) => {
      if (index >= currentIndex && index < currentIndex + cardsToShow) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Disable buttons at boundaries
    if (prevBtn && nextBtn) {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= areaCards.length - cardsToShow;
      
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      nextBtn.style.opacity = currentIndex >= areaCards.length - cardsToShow ? '0.5' : '1';
    }
  }

  function nextArea() {
    if (currentIndex < areaCards.length - cardsToShow) {
      currentIndex++;
      updateCarousel();
    }
  }

  function prevArea() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevArea);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextArea);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && document.activeElement.closest('.practice-areas')) {
      prevArea();
    } else if (e.key === 'ArrowRight' && document.activeElement.closest('.practice-areas')) {
      nextArea();
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCardsToShow = getCardsToShow();
      if (newCardsToShow !== cardsToShow) {
        currentIndex = 0;
        updateCarousel();
      }
    }, 250);
  });

  // Initialize
  updateCarousel();
}

function initHeroParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroMedia = document.querySelector('.hero-media');
  if (!heroMedia) return;

  let ticking = false;

  function updateParallax(x, y) {
    const rect = heroMedia.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (x - centerX) / rect.width;
    const deltaY = (y - centerY) / rect.height;

    const moveX = deltaX * 8;
    const moveY = deltaY * 8;

    heroMedia.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax(e.clientX, e.clientY);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initHeroVisibility() {
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => {
      hero.classList.add('is-visible');
    }, 100);
  }
}

function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle sections with data-reveal
        if (entry.target.hasAttribute('data-reveal')) {
          entry.target.classList.add('is-visible');
        }

        // Handle individual animated elements
        if (entry.target.classList.contains('animate-on-scroll') || 
            entry.target.classList.contains('animate-fade-in')) {
          entry.target.classList.add('in-view');
        }

        // Handle stagger containers
        if (entry.target.classList.contains('stagger-container')) {
          const items = entry.target.querySelectorAll('.stagger-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('in-view');
            }, index * 120);
          });
        }

        // Animate stats when market-shift section is visible
        if (entry.target.classList.contains('market-shift')) {
          animateStats(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe sections with data-reveal
  document.querySelectorAll('[data-reveal]').forEach(section => {
    observer.observe(section);
  });

  // Observe individual animated elements
  document.querySelectorAll('.animate-on-scroll, .animate-fade-in, .stagger-container').forEach(el => {
    observer.observe(el);
  });
}

function animateStats(section) {
  const statValues = section.querySelectorAll('.stat-value');

  statValues.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 1000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOutProgress * target);
      stat.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

function initStatCounters() {
  // Stats are now handled by the scroll reveal
}

function initTestimonialsCarousel() {
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('[data-direction="prev"]');
  const nextBtn = document.querySelector('[data-direction="next"]');

  if (!testimonials.length) return;

  let currentIndex = 0;
  let autoplayInterval;
  let isPaused = false;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      if (i === index) {
        testimonial.classList.add('active');
      } else {
        testimonial.classList.remove('active');
      }
    });
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function startAutoplay() {
    if (!isPaused) {
      autoplayInterval = setInterval(nextTestimonial, 4000);
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevTestimonial();
      stopAutoplay();
      isPaused = true;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextTestimonial();
      stopAutoplay();
      isPaused = true;
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevTestimonial();
      stopAutoplay();
      isPaused = true;
    } else if (e.key === 'ArrowRight') {
      nextTestimonial();
      stopAutoplay();
      isPaused = true;
    }
  });

  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', () => {
      if (!isPaused) startAutoplay();
    });
  }

  startAutoplay();
}

function initHeroParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroMedia = document.querySelector('.hero-media');
  if (!heroMedia) return;

  let ticking = false;

  function updateParallax(x, y) {
    const rect = heroMedia.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (x - centerX) / rect.width;
    const deltaY = (y - centerY) / rect.height;

    const moveX = deltaX * 8;
    const moveY = deltaY * 8;

    heroMedia.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax(e.clientX, e.clientY);
        ticking = false;
      });
      ticking = true;
    }
  });
}