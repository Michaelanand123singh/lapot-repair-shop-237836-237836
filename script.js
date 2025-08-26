document.addEventListener('DOMContentLoaded', () => {

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = mobileMenu?.querySelectorAll('a'); // Only query if mobileMenu exists
  let firstFocusableElement;
  let lastFocusableElement;
  let isMenuOpen = false;

  const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="url"], input[type="tel"], input[type="email"], input[type="search"], input[type="number"], input[type="datetime"], select, [tabindex]:not([tabindex="-1"])');

    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) { // if shift key pressed for shift + tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else { // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    });
  };

  if (menuToggle && mobileMenu) {

    menuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open');
      document.body.classList.toggle('mobile-menu-open'); // Prevent scrolling on body

      if(isMenuOpen){
        trapFocus(mobileMenu);
        // Focus first element on opening
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      } else {
        //Remove focus trap and return focus to the trigger button
        mobileMenu.removeEventListener('keydown', trapFocus);
        menuToggle.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (isMenuOpen) {
          mobileMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          document.body.classList.remove('mobile-menu-open');
          isMenuOpen = false;
          menuToggle.focus(); // Return focus to the toggle
        }
      }
    });

    //Close on outside click

    document.addEventListener('click', (event) => {
      if (isMenuOpen && !mobileMenu.contains(event.target) && event.target !== menuToggle) {
          mobileMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          document.body.classList.remove('mobile-menu-open');
          isMenuOpen = false;
      }
    });

    // Close menu when a link is clicked (optional)
    if(menuLinks){
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            document.body.classList.remove('mobile-menu-open');
            isMenuOpen = false;
        });
      });
    }
  }
  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('.back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update the URL (optional)
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  // Testimonial Slider
  const sliderContainer = document.querySelector('.testimonial-slider');
  if (sliderContainer) {
    const slides = sliderContainer.querySelectorAll('.testimonial-slide');
    const prevButton = sliderContainer.querySelector('.slider-prev');
    const nextButton = sliderContainer.querySelector('.slider-next');
    let currentIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    if (slides.length > 0) {
      showSlide(currentIndex); // Show initial slide
      startAutoSlide(); // Start auto-sliding

      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);

      if(prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });

        nextButton.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
      }
    }
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle the clicked item
      item.classList.toggle('open');
      content.setAttribute('aria-hidden', isOpen); // Toggle aria-hidden
    });
  });

  // Email Capture Validation
  const emailForm = document.querySelector('.email-capture-form');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email]');
      const emailValue = emailInput.value.trim();

      if (!isValidEmail(emailValue)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate submission
      console.log('Submitting email:', emailValue);
      emailInput.value = ''; // Clear the input
    });
  }
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA Click Logging
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const utmParams = getUtmParams(); // Get UTM parameters
      const buttonText = button.textContent.trim(); // Get CTA text

      // Log data (replace with your actual logging mechanism)
      console.log('CTA Clicked:', buttonText, utmParams);
    });
  });

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    for (const [key, value] of params) {
      if (key.startsWith('utm_')) {
        utm[key] = value;
      }
    }
    return utm;
  }
});

// Defer image loading (example, can be expanded)
const images = document.querySelectorAll('img[data-src]');

const lazyLoad = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};

if('IntersectionObserver' in window){
  const observer = new IntersectionObserver((items, observer) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        lazyLoad(item.target);
        observer.unobserve(item.target);
      }
    });
  });

  images.forEach((img) => {
    observer.observe(img);
  });
} else {
  // Fallback for browsers that don't support IntersectionObserver
  images.forEach((img) => lazyLoad(img));
}