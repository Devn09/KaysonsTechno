(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const loader = document.querySelector('.site-loader');
  const progress = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipLoader = html.classList.contains('skip-site-loader');
  const startedAt = performance.now();
  let loaderClosed = false;

  /* First-visit loader: short, branded and never blocking. */
  const closeLoader = (immediate = false) => {
    if (loaderClosed) return;
    loaderClosed = true;
    loader?.classList.add('is-hidden');
    loader?.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-loading');
    try {
      window.sessionStorage.setItem('kaysons-loader-seen', '1');
    } catch (error) {
      // The site remains usable when browser storage is unavailable.
    }
    if (immediate) loader?.remove();
    else window.setTimeout(() => loader?.remove(), 460);
  };

  const scheduleLoaderClose = () => {
    const minimumDisplay = reduceMotion ? 0 : 420;
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

  // Absolute failsafe: a slow external iframe or browser event can never cover the page.
  window.setTimeout(closeLoader, 1300);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) closeLoader(true);
  });

  /* Responsive primary navigation. */
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('#primary-navigation');

  const closeNavigation = (returnFocus = false) => {
    body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    if (returnFocus) navToggle?.focus();
  };

  navToggle?.addEventListener('click', () => {
    const opening = !body.classList.contains('nav-open');
    body.classList.toggle('nav-open', opening);
    navToggle.setAttribute('aria-expanded', String(opening));
  });

  primaryNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeNavigation());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) {
      closeNavigation(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!body.classList.contains('nav-open')) return;
    if (!header?.contains(event.target)) closeNavigation();
  });

  window.matchMedia('(min-width: 761px)').addEventListener?.('change', (event) => {
    if (event.matches) closeNavigation();
  });

  // Mark same-site navigation before the next document paints so the loader is skipped.
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }
    if (destination.origin !== window.location.origin) return;
    link.addEventListener('pointerdown', () => {
      try { window.sessionStorage.setItem('kaysons-loader-seen', '1'); } catch (error) {}
    }, { passive: true });
  });

  /* Scroll progress, condensed header and back-to-top. */
  let scrollFrame = 0;
  const updateScrollUi = () => {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
    backToTop?.classList.toggle('is-visible', window.scrollY > 560);
  };

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollUi);
  }, { passive: true });
  updateScrollUi();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* Purposeful scroll reveals with reduced-motion support. */
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
    ['.process-grid', 'article']
  ].forEach(([containerSelector, itemSelector]) => {
    document.querySelectorAll(containerSelector).forEach((container) => {
      container.querySelectorAll(itemSelector).forEach((item, index) => {
        addReveal(item, 'scale');
        item.style.setProperty('--reveal-delay', `${Math.min(index * 55, 275)}ms`);
      });
    });
  });

  document.querySelectorAll('.capability-list').forEach((container) => {
    Array.from(container.children).forEach((item, index) => {
      addReveal(item, 'scale');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
    });
  });

  const activateReveals = () => {
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
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach((item) => observer.observe(item));
  };

  activateReveals();

  /* Product media registry and product filtering. */
  const productCards = Array.from(document.querySelectorAll('.catalogue-card'));
  const productAssets = window.KAYSONS_PRODUCT_ASSETS || {};
  const normaliseValues = (values) => Array.isArray(values)
    ? values.map((value) => String(value).trim().toLowerCase()).filter(Boolean)
    : [];

  const makeResource = (label, href = '', readyWithoutLink = false) => {
    const element = href ? document.createElement('a') : document.createElement('span');
    element.textContent = label;
    if (href) {
      element.href = href;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.className = 'resource-link';
    } else {
      element.className = readyWithoutLink ? 'resource-ready' : 'resource-pending';
    }
    return element;
  };

  productCards.forEach((card) => {
    const asset = productAssets[card.id] || {};
    const copy = card.querySelector('.catalogue-copy');
    const cta = card.querySelector('.catalogue-discuss');
    const visual = card.querySelector('.catalogue-visual');
    const image = card.querySelector('.visual-mark img');
    if (!copy || !cta) return;

    const gasGroups = normaliseValues(asset.gasGroups);
    const zones = normaliseValues(asset.zones);
    const certifications = normaliseValues(asset.certifications);
    card.dataset.gasGroups = gasGroups.join(' ');
    card.dataset.zones = zones.join(' ');
    card.dataset.certifications = certifications.join(' ');

    if (asset.image && image) {
      image.src = asset.image;
      image.alt = asset.imageAlt || `${card.querySelector('h2')?.textContent || 'Kaysons product'} photograph`;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.removeAttribute('width');
      image.removeAttribute('height');
      visual?.removeAttribute('aria-hidden');
      card.classList.add('has-product-image');
    }

    if (copy.querySelector('.product-resources')) return;
    const resources = document.createElement('div');
    resources.className = 'product-resources';
    resources.setAttribute('aria-label', 'Product media and downloads');
    resources.append(makeResource(asset.image ? 'Photo ready' : 'Photo pending', '', Boolean(asset.image)));
    resources.append(makeResource(asset.datasheet ? 'Technical datasheet' : 'Datasheet pending', asset.datasheet || ''));
    resources.append(makeResource(asset.catalogue ? 'Product catalogue' : 'Catalogue pending', asset.catalogue || ''));

    if (Array.isArray(asset.certificates) && asset.certificates.length) {
      asset.certificates.forEach((certificate) => {
        if (certificate?.href) resources.append(makeResource(certificate.label || 'Certificate', certificate.href));
      });
    } else {
      resources.append(makeResource('Certificates pending'));
    }
    copy.insertBefore(resources, cta);
  });

  const searchInput = document.querySelector('#product-search');
  const protectionFilter = document.querySelector('#protection-filter');
  const gasFilter = document.querySelector('#gas-filter');
  const zoneFilter = document.querySelector('#zone-filter');
  const certificationFilter = document.querySelector('#certification-filter');
  const filterReset = document.querySelector('.filter-reset');
  const filterCount = document.querySelector('#filter-count');
  const catalogueGrid = document.querySelector('.catalogue-grid');
  let filterEmpty = null;

  const activateDataFilter = (filter, datasetKey) => {
    if (!filter) return;
    const hasProductData = productCards.some((card) => (card.dataset[datasetKey] || '').trim());
    filter.disabled = !hasProductData;
  };

  activateDataFilter(gasFilter, 'gasGroups');
  activateDataFilter(zoneFilter, 'zones');
  activateDataFilter(certificationFilter, 'certifications');

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
    const gasGroup = gasFilter?.value || '';
    const zone = zoneFilter?.value || '';
    const certification = certificationFilter?.value || '';
    let visible = 0;

    productCards.forEach((card) => {
      const matchesText = !query || card.textContent.toLowerCase().includes(query);
      const concepts = (card.dataset.protection || '').split(' ');
      const gasGroups = (card.dataset.gasGroups || '').split(' ');
      const zones = (card.dataset.zones || '').split(' ');
      const certifications = (card.dataset.certifications || '').split(' ');
      const matchesProtection = !protection || concepts.includes(protection);
      const matchesGasGroup = !gasGroup || gasGroups.includes(gasGroup);
      const matchesZone = !zone || zones.includes(zone);
      const matchesCertification = !certification || certifications.includes(certification);
      const show = matchesText && matchesProtection && matchesGasGroup && matchesZone && matchesCertification;
      card.classList.toggle('is-filtered-out', !show);
      if (show) visible += 1;
    });

    if (filterCount) filterCount.textContent = `${visible} product group${visible === 1 ? '' : 's'}`;
    if (filterEmpty) filterEmpty.hidden = visible !== 0;
  };

  searchInput?.addEventListener('input', applyProductFilters);
  protectionFilter?.addEventListener('change', applyProductFilters);
  gasFilter?.addEventListener('change', applyProductFilters);
  zoneFilter?.addEventListener('change', applyProductFilters);
  certificationFilter?.addEventListener('change', applyProductFilters);
  filterReset?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (protectionFilter) protectionFilter.value = '';
    if (gasFilter) gasFilter.value = '';
    if (zoneFilter) zoneFilter.value = '';
    if (certificationFilter) certificationFilter.value = '';
    applyProductFilters();
    searchInput?.focus();
  });

  /* Enquiry form: EmailJS when configured, email fallback otherwise. */
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

  const withTimeout = (promise, duration = 12000) => Promise.race([
    promise,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error('Request timed out')), duration))
  ]);

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
        const firstInvalidField = form.querySelector(':invalid');
        firstInvalidField?.focus({ preventScroll: true });
        firstInvalidField?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
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
        window.location.assign(`mailto:sales@kaysonstechno.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`);
        return;
      }

      if (button) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.dataset.label = button.innerHTML;
        button.textContent = 'Sending…';
      }
      if (status) status.textContent = 'Sending your enquiry securely…';

      try {
        await withTimeout(loadExternalScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', 'emailjs-browser-sdk'));
        await withTimeout(window.emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form, {
          publicKey: emailConfig.publicKey
        }));
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
          button.removeAttribute('aria-busy');
          button.innerHTML = button.dataset.label || 'Send enquiry <span>→</span>';
        }
      }
    });
  });

  /* Consent-based basic analytics. */
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
