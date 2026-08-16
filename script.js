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
    ['.portfolio-filter', ''],
    ['.catalogue-toolbar', ''],
    ['.heritage-intro', 'left'],
    ['.industry-panel', 'right'],
    ['.map-copy', 'left'],
    ['.map-frame', 'right'],
    ['.legal-grid aside', 'left'],
    ['.legal-copy', 'right']
  ].forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element) => addReveal(element, direction));
  });

  [
    ['.approval-marks', '.approval-mark'],
    ['.home-capability-grid', 'article'],
    ['.why-points', 'article'],
    ['.industry-chips', 'span'],
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

  const productCards = Array.from(document.querySelectorAll('.catalogue-card'));
  productCards.forEach((card) => {
    const copy = card.querySelector('.catalogue-copy');
    const cta = card.querySelector('.catalogue-discuss');
    if (!copy || !cta || copy.querySelector('.product-resources')) return;
    const resources = document.createElement('div');
    resources.className = 'product-resources';
    resources.setAttribute('aria-label', 'Product media and download provisions');
    resources.innerHTML = '<span>Product photo pending</span><span>Datasheet pending</span><span>Certificates pending</span>';
    copy.insertBefore(resources, cta);
  });

  const searchInput = document.querySelector('#product-search');
  const protectionFilter = document.querySelector('#protection-filter');
  const filterReset = document.querySelector('.filter-reset');
  const filterCount = document.querySelector('#filter-count');
  const catalogueGrid = document.querySelector('.catalogue-grid');
  let filterEmpty = null;

  if (catalogueGrid && productCards.length) {
    filterEmpty = document.createElement('p');
    filterEmpty.className = 'filter-empty';
    filterEmpty.hidden = true;
    filterEmpty.textContent = 'No product group matches this search. Reset the filters or discuss the application with Kaysons.';
    catalogueGrid.append(filterEmpty);
  }

  const applyProductFilters = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const protection = protectionFilter?.value || '';
    let visible = 0;

    productCards.forEach((card) => {
      const matchesText = !query || card.textContent.toLowerCase().includes(query);
      const concepts = (card.dataset.protection || '').split(' ');
      const matchesProtection = !protection || concepts.includes(protection);
      const show = matchesText && matchesProtection;
      card.classList.toggle('is-filtered-out', !show);
      if (show) visible += 1;
    });

    if (filterCount) filterCount.textContent = `${visible} product group${visible === 1 ? '' : 's'}`;
    if (filterEmpty) filterEmpty.hidden = visible !== 0;
  };

  searchInput?.addEventListener('input', applyProductFilters);
  protectionFilter?.addEventListener('change', applyProductFilters);
  filterReset?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (protectionFilter) protectionFilter.value = '';
    applyProductFilters();
    searchInput?.focus();
  });

  const loadExternalScript = (source, id) => new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
      }
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = source;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });

  const siteConfig = window.KAYSONS_SITE_CONFIG || {};
  const emailConfig = siteConfig.emailjs || {};

  document.querySelectorAll('.requirement-form').forEach((form) => {
    const params = new URLSearchParams(window.location.search);
    const product = form.querySelector('[name="product"]');
    if (product && params.get('product')) product.value = params.get('product');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      const button = form.querySelector('button[type="submit"]');
      const honeypot = form.querySelector('[name="website"]');

      status?.classList.remove('is-success', 'is-error');
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.textContent = 'Please complete the required fields and privacy consent.';
          status.classList.add('is-error');
        }
        return;
      }
      if (honeypot?.value) return;

      const configured = [emailConfig.publicKey, emailConfig.serviceId, emailConfig.templateId]
        .every((value) => typeof value === 'string' && value.trim().length > 3);

      if (!configured) {
        const data = new FormData(form);
        const subject = `Website enquiry — ${data.get('product') || 'Hazardous-area requirement'}`;
        const message = [
          `Name: ${data.get('from_name') || ''}`,
          `Company: ${data.get('company') || ''}`,
          `Phone: ${data.get('phone') || ''}`,
          `Email: ${data.get('reply_to') || ''}`,
          `Product: ${data.get('product') || 'Not specified'}`,
          `Protection: ${data.get('protection') || 'Not specified'}`,
          `Project stage: ${data.get('project_stage') || 'Not specified'}`,
          '',
          String(data.get('message') || '')
        ].join('\n');
        if (status) {
          status.textContent = 'Opening your email application with the enquiry prepared.';
          status.classList.add('is-success');
        }
        window.location.href = `mailto:sales@kaysonstechno.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        return;
      }

      if (button) {
        button.disabled = true;
        button.dataset.label = button.innerHTML;
        button.textContent = 'Sending…';
      }
      if (status) status.textContent = 'Sending your enquiry securely…';

      try {
        await loadExternalScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', 'emailjs-browser-sdk');
        await window.emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form, {
          publicKey: emailConfig.publicKey
        });
        if (status) {
          status.textContent = 'Thank you. Your requirement has been sent to the Kaysons sales team.';
          status.classList.add('is-success');
        }
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { form_name: 'hazardous_area_requirement' });
        }
        form.reset();
      } catch (error) {
        if (status) {
          status.textContent = 'The enquiry could not be sent online. Please email sales@kaysonstechno.com or call the sales team.';
          status.classList.add('is-error');
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.innerHTML = button.dataset.label || 'Send enquiry <span>→</span>';
        }
      }
    });
  });

  const analyticsId = siteConfig.analytics?.measurementId?.trim() || '';
  const analyticsConfigured = /^G-[A-Z0-9]+$/i.test(analyticsId);
  const consentKey = 'kaysons-analytics-consent';

  const loadAnalytics = () => {
    if (!analyticsConfigured || window.__kaysonsAnalyticsLoaded) return;
    window.__kaysonsAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    loadExternalScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`, 'kaysons-ga4').catch(() => {});
  };

  const buildConsentBanner = () => {
    if (!analyticsConfigured || document.querySelector('.consent-banner')) return;
    const banner = document.createElement('aside');
    banner.className = 'consent-banner';
    banner.setAttribute('aria-label', 'Analytics preference');
    banner.innerHTML = '<strong>Your privacy choice</strong><p>Kaysons uses optional analytics to understand website usage. Essential site functions work without it. Read the <a href="legal.html#privacy">Privacy Policy</a>.</p><div class="consent-actions"><button type="button" data-consent="granted">Allow analytics</button><button type="button" data-consent="denied">Essential only</button></div>';
    document.body.append(banner);
    banner.querySelectorAll('[data-consent]').forEach((button) => {
      button.addEventListener('click', () => {
        const choice = button.dataset.consent;
        try { window.localStorage.setItem(consentKey, choice); } catch (error) {}
        banner.remove();
        if (choice === 'granted') loadAnalytics();
      });
    });
  };

  if (analyticsConfigured) {
    let consent = '';
    try { consent = window.localStorage.getItem(consentKey) || ''; } catch (error) {}
    if (consent === 'granted') loadAnalytics();
    else if (consent !== 'denied') buildConsentBanner();
  }

  document.querySelectorAll('[data-manage-consent]').forEach((button) => {
    button.addEventListener('click', () => {
      try { window.localStorage.removeItem(consentKey); } catch (error) {}
      buildConsentBanner();
    });
  });
})();
