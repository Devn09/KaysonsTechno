(() => {
  const body = document.body;
  const loader = document.querySelector('.site-loader');
  const progress = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipLoader = document.documentElement.classList.contains('skip-site-loader');
  const startedAt = performance.now();
  let loaderClosed = false;
  let revealsActivated = false;

  const revealTargets = [];
  const addReveal = (element, direction = '') => {
    if (!element || element.hasAttribute('data-reveal')) return;
    element.setAttribute('data-reveal', direction);
    revealTargets.push(element);
  };

  addReveal(document.querySelector('.hero-content'), 'left');
  addReveal(document.querySelector('.hazard-panel'), 'right');
  document.querySelectorAll('.page-hero-grid > *').forEach((element, index) => {
    addReveal(element, index === 0 ? 'left' : 'right');
  });

  [
    ['.approval-intro', 'left'],
    ['.section-heading', ''],
    ['.why-title-block', 'left'],
    ['.cta-grid', ''],
    ['.about-statement', 'left'],
    ['.about-copy', 'right'],
    ['.capability-title', 'left'],
    ['.contact-details', 'left'],
    ['.requirement-form', 'right'],
    ['.protection-bar', ''],
    ['.catalogue-toolbar', '']
  ].forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element) => addReveal(element, direction));
  });

  [
    ['.approval-marks', '.approval-mark'],
    ['.home-capability-grid', 'article'],
    ['.why-points', 'article'],
    ['.catalogue-grid', '.catalogue-card'],
    ['.process-grid', 'article'],
    ['.capability-list', ':scope > div']
  ].forEach(([containerSelector, itemSelector]) => {
    document.querySelectorAll(containerSelector).forEach((container) => {
      container.querySelectorAll(itemSelector).forEach((item, index) => {
        addReveal(item, 'scale');
        item.style.setProperty('--reveal-delay', `${Math.min(index * 65, 325)}ms`);
      });
    });
  });

  const activateReveals = () => {
    if (revealsActivated) return;
    revealsActivated = true;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealTargets.forEach((item) => observer.observe(item));
  };

  const closeLoader = (immediate = false) => {
    if (loaderClosed) return;
    loaderClosed = true;
    loader?.classList.add('is-hidden');
    loader?.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-loading');
    try {
      window.sessionStorage.setItem('kaysons-loader-seen', '1');
    } catch (error) {
      // Storage can be disabled; the loader still closes normally.
    }
    activateReveals();
    if (immediate) loader?.remove();
    else window.setTimeout(() => loader?.remove(), 650);
  };

  const scheduleLoaderClose = () => {
    if (reduceMotion) {
      closeLoader();
      return;
    }
    const minimumDisplay = 620;
    const remaining = Math.max(0, minimumDisplay - (performance.now() - startedAt));
    window.setTimeout(closeLoader, remaining);
  };

  if (skipLoader) {
    closeLoader(true);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleLoaderClose, { once: true });
  } else {
    scheduleLoaderClose();
  }

  // Never leave the page covered if the browser delays a lifecycle event.
  window.setTimeout(closeLoader, 2000);

  let scrollFrame = 0;
  const updateScrollUi = () => {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
    backToTop?.classList.toggle('is-visible', window.scrollY > 520);
  };

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollUi);
  }, { passive: true });
  updateScrollUi();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  document.querySelectorAll('.requirement-form').forEach((form) => {
    const params = new URLSearchParams(window.location.search);
    const product = form.querySelector('[name="product"]');
    if (product && params.get('product')) product.value = params.get('product');

    form.querySelector('button')?.addEventListener('click', () => {
      window.alert('This demo form is ready to be connected to your preferred form service. You can also email sales@kaysonstechno.com.');
    });
  });
})();
