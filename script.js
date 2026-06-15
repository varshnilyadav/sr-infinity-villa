/* ============================================================
   SR INFINITY VILLAS — Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Access Control Lock Screen ----
  const lockScreen = document.getElementById('lockScreen');
  const lockForm = document.getElementById('lockForm');
  const lockUserId = document.getElementById('lockUserId');
  const lockPassword = document.getElementById('lockPassword');
  const lockError = document.getElementById('lockError');

  if (lockForm) {
    // Check if already authorized (safeguard)
    if (sessionStorage.getItem('sr_infinity_authorized') === 'true') {
      if (lockScreen) lockScreen.remove();
    } else {
      lockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = lockUserId.value.trim();
        const password = lockPassword.value;

        if (username === 'varshnil' && password === 'munna') {
          sessionStorage.setItem('sr_infinity_authorized', 'true');
          document.documentElement.classList.remove('is-locked');
          document.documentElement.classList.add('authorized');
          
          // Disable inputs during transition
          lockUserId.disabled = true;
          lockPassword.disabled = true;
          const lockBtn = lockForm.querySelector('.lock-btn');
          if (lockBtn) lockBtn.disabled = true;
          
          // Clean up the lock screen after fade-out transition
          setTimeout(() => {
            if (lockScreen) {
              lockScreen.remove();
            }
          }, 600);
        } else {
          // Show error message
          if (lockError) {
            lockError.textContent = 'Invalid User ID or Password';
            lockError.style.opacity = '1';
          }
          
          // Shake the card to indicate failure
          const lockCard = lockForm.closest('.lock-card');
          if (lockCard) {
            lockCard.classList.remove('lock-shake');
            void lockCard.offsetWidth; // Trigger reflow
            lockCard.classList.add('lock-shake');
          }
          
          // Clear and focus password
          if (lockPassword) {
            lockPassword.value = '';
            lockPassword.focus();
          }
        }
      });

      // Clear error message when user starts typing again
      const clearError = () => {
        if (lockError && lockError.textContent) {
          lockError.style.opacity = '0';
          setTimeout(() => {
            if (lockError.style.opacity === '0') {
              lockError.textContent = '';
            }
          }, 200);
        }
      };

      if (lockUserId) lockUserId.addEventListener('input', clearError);
      if (lockPassword) lockPassword.addEventListener('input', clearError);
    }
  }

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Active Navigation Link ----
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile Menu ----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', toggleMobileMenu);

  // Close on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 10;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll Reveal Animations (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Floor Plan Tabs ----
  // Main tabs: East / West
  const mainTabs = document.querySelectorAll('#villaTypeTabs .floorplans__tab');
  const mainContents = {
    east: document.getElementById('tab-east'),
    west: document.getElementById('tab-west')
  };

  mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      mainTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide content
      const target = tab.dataset.tab;
      Object.values(mainContents).forEach(c => c.classList.remove('active'));
      mainContents[target].classList.add('active');
    });
  });

  // Sub-tabs for East
  setupSubTabs('eastSubTabs');
  // Sub-tabs for West
  setupSubTabs('westSubTabs');

  function setupSubTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const subTabs = container.querySelectorAll('.floorplans__sub-tab');
    
    subTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active sub-tab
        subTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show/hide sub-content
        const target = tab.dataset.subtab;
        const parent = container.parentElement;
        const subContents = parent.querySelectorAll('[id^="subtab-"]');
        subContents.forEach(c => c.classList.remove('active'));
        
        const targetContent = document.getElementById(`subtab-${target}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // ---- Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.lightbox;
      const caption = card.dataset.caption || '';
      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.phone || !data.email || !data.villaType) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showFormMessage('Thank you! Our team will contact you shortly to schedule your site visit.', 'success');
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  function showFormMessage(message, type) {
    // Remove existing message if any
    const existing = contactForm.querySelector('.form-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message--${type}`;
    msgEl.textContent = message;
    msgEl.style.cssText = `
      padding: 1rem 1.5rem;
      border-radius: 10px;
      margin-top: 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      animation: fadeIn 0.4s ease;
      ${type === 'success' 
        ? 'background: rgba(76, 175, 80, 0.15); color: #81C784; border: 1px solid rgba(76, 175, 80, 0.3);' 
        : 'background: rgba(244, 67, 54, 0.15); color: #EF5350; border: 1px solid rgba(244, 67, 54, 0.3);'}
    `;
    contactForm.appendChild(msgEl);

    setTimeout(() => msgEl.remove(), 6000);
  }

  // ---- Counter Animation for Stat Cards ----
  const statValues = document.querySelectorAll('.stat-card__value');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        
        // Only animate numeric values
        const numMatch = text.match(/^([\d.]+)/);
        if (numMatch) {
          const targetNum = parseFloat(numMatch[1]);
          const suffix = text.replace(numMatch[1], '');
          const isFloat = text.includes('.');
          const duration = 1500;
          const startTime = performance.now();

          function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = targetNum * eased;
            
            if (isFloat) {
              el.textContent = current.toFixed(2) + suffix;
            } else {
              el.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = text; // Ensure final value is exact
            }
          }

          requestAnimationFrame(animate);
        }
        
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterObserver.observe(el));

  // ---- Parallax on hero (subtle) ----
  const heroBg = document.querySelector('.hero__bg img');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
  }, { passive: true });

});
