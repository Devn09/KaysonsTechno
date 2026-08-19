(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const iconArrow = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const lockScroll = () => html.classList.add('is-locked');
  const unlockScroll = () => html.classList.remove('is-locked');

  /* The loader is deliberately first-session only so internal page navigation never buffers. */
  const loader = document.querySelector('.page-loader');
  const loaderFill = document.querySelector('.loader-fill');
  const loaderCount = document.querySelector('.loader-count');
  const skipIntro = html.classList.contains('skip-intro');
  let pageReady = skipIntro;

  const finishIntro = () => {
    if (pageReady) return;
    pageReady = true;
    loader?.classList.add('is-exiting');
    html.classList.add('ready');
    unlockScroll();
    window.setTimeout(() => loader?.remove(), reduceMotion ? 20 : 800);
    document.dispatchEvent(new CustomEvent('kaysons:ready'));
  };

  if (skipIntro) {
    html.classList.add('ready');
    loader?.remove();
  } else if (loader) {
    lockScroll();
    try { sessionStorage.setItem('kaysons-intro-seen', '1'); } catch (error) {}
    const started = performance.now();
    const duration = reduceMotion ? 80 : 1300;
    const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const value = Math.round(ease(progress) * 100);
      if (loaderFill) loaderFill.style.width = `${value}%`;
      if (loaderCount) loaderCount.textContent = String(value).padStart(3, '0');
      if (progress < 1) requestAnimationFrame(tick);
      else window.setTimeout(finishIntro, reduceMotion ? 0 : 110);
    };
    requestAnimationFrame(tick);
    window.setTimeout(finishIntro, 2600);
  } else {
    html.classList.add('ready');
    pageReady = true;
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let target;
    try { target = new URL(link.href, location.href); } catch (error) { return; }
    if (target.origin !== location.origin) return;
    const markSeen = () => { try { sessionStorage.setItem('kaysons-intro-seen', '1'); } catch (error) {} };
    link.addEventListener('pointerdown', markSeen, { passive: true });
    link.addEventListener('keydown', (event) => { if (event.key === 'Enter') markSeen(); });
  });

  /* Live India time. */
  const updateClock = () => {
    const date = new Date();
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true
    }).format(date).replace(/\s/g, '').toLowerCase();
    const fullDate = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
    document.querySelectorAll('[data-local-time]').forEach((el) => { el.textContent = parts; });
    document.querySelectorAll('[data-local-date]').forEach((el) => { el.textContent = fullDate; });
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  /* Mobile navigation is never rendered as the desktop navigation control. */
  const mobileNav = document.querySelector('.mobile-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.mobile-nav-close');
  let navReturnFocus = null;
  const openNav = () => {
    if (!mobileNav) return;
    navReturnFocus = document.activeElement;
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle?.setAttribute('aria-expanded', 'true');
    lockScroll();
    window.setTimeout(() => menuClose?.focus(), 80);
  };
  const closeNav = (restoreFocus = true) => {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
    unlockScroll();
    if (restoreFocus && navReturnFocus instanceof HTMLElement) navReturnFocus.focus();
  };
  menuToggle?.addEventListener('click', openNav);
  menuClose?.addEventListener('click', () => closeNav());
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeNav(false)));
  window.matchMedia('(min-width: 761px)').addEventListener?.('change', (event) => { if (event.matches) closeNav(false); });

  /* Requirement modal. */
  const modal = document.querySelector('.request-modal');
  const modalPanel = modal?.querySelector('.modal-panel');
  const modalClose = modal?.querySelector('.modal-close');
  const modalForm = modal?.querySelector('.modal-form');
  let modalReturnFocus = null;
  const openModal = (trigger) => {
    if (!modal) {
      location.href = 'contact.html';
      return;
    }
    if (mobileNav?.classList.contains('is-open')) closeNav(false);
    modalReturnFocus = trigger || document.activeElement;
    const requested = trigger?.dataset.product || '';
    const productField = modalForm?.querySelector('[name="product"]');
    if (productField && requested) productField.value = requested;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll();
    window.setTimeout(() => modalForm?.querySelector('input:not([type="hidden"])')?.focus(), 80);
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
  };
  document.querySelectorAll('[data-open-request]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(trigger);
    });
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  modalPanel?.addEventListener('click', (event) => event.stopPropagation());

  const keepFocusInside = (container, event) => {
    const focusable = Array.from(container.querySelectorAll('a[href], button:not(:disabled), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.hasAttribute('hidden'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  document.addEventListener('keydown', (event) => {
    const activeLayer = modal?.classList.contains('is-open') ? modalPanel : mobileNav?.classList.contains('is-open') ? mobileNav : null;
    if (event.key === 'Tab' && activeLayer) keepFocusInside(activeLayer, event);
    if (event.key !== 'Escape') return;
    if (modal?.classList.contains('is-open')) closeModal();
    else if (mobileNav?.classList.contains('is-open')) closeNav();
  });

  /* Reveals and staggered word motion. */
  document.querySelectorAll('[data-word-reveal]').forEach((element) => {
    if (element.querySelector('.word')) return;
    const words = element.textContent.trim().split(/\s+/);
    element.textContent = '';
    element.classList.add('word-reveal');
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--word-index', index);
      span.textContent = `${word}\u00a0`;
      element.append(span);
    });
  });

  const revealItems = Array.from(document.querySelectorAll('[data-reveal], [data-word-reveal]'));
  const startReveals = () => {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  };
  if (pageReady) startReveals();
  else document.addEventListener('kaysons:ready', startReveals, { once: true });

  /* Homepage protection carousel. */
  const specSlide = document.querySelector('.spec-slide');
  const specDots = Array.from(document.querySelectorAll('.spec-dots span'));
  const specPrev = document.querySelector('[data-spec-prev]');
  const specNext = document.querySelector('[data-spec-next]');
  const specs = [
    { label: 'Flameproof protection', value: 'Ex d · Contain an internal ignition.' },
    { label: 'Increased safety', value: 'Ex e · Prevent arcs and excessive heat.' },
    { label: 'Dust protection', value: 'Ex t · Control ignition risk from dust.' }
  ];
  let specIndex = 0;
  const renderSpec = (nextIndex) => {
    if (!specSlide) return;
    specIndex = (nextIndex + specs.length) % specs.length;
    specSlide.classList.add('is-changing');
    window.setTimeout(() => {
      specSlide.querySelector('small').textContent = specs[specIndex].label;
      specSlide.querySelector('strong').textContent = specs[specIndex].value;
      specDots.forEach((dot, index) => dot.classList.toggle('active', index === specIndex));
      specSlide.classList.remove('is-changing');
    }, reduceMotion ? 0 : 190);
  };
  specPrev?.addEventListener('click', () => renderSpec(specIndex - 1));
  specNext?.addEventListener('click', () => renderSpec(specIndex + 1));

  /* Stats count once when visible. */
  const stats = Array.from(document.querySelectorAll('[data-count]'));
  const animateStat = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    const duration = reduceMotion ? 0 : 1200;
    const start = performance.now();
    const update = (now) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };
  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStat(entry.target);
        statsObserver.unobserve(entry.target);
      });
    }, { threshold: .25 });
    stats.forEach((stat) => statsObserver.observe(stat));
  } else {
    stats.forEach(animateStat);
  }

  /* Product asset registry and filters. */
  const productCards = Array.from(document.querySelectorAll('.catalogue-card'));
  const productAssets = window.KAYSONS_PRODUCT_ASSETS || {};
  const normalise = (value) => Array.isArray(value) ? value.map((item) => String(item).trim().toLowerCase()).filter(Boolean) : [];
  const resourceNode = (label, href = '') => {
    const node = document.createElement(href ? 'a' : 'span');
    node.textContent = label;
    if (href) { node.href = href; node.target = '_blank'; node.rel = 'noopener noreferrer'; }
    return node;
  };

  productCards.forEach((card) => {
    const asset = productAssets[card.id] || {};
    const media = card.querySelector('.catalogue-media');
    const image = media?.querySelector('img');
    const copy = card.querySelector('.catalogue-copy');
    const discuss = card.querySelector('.catalogue-discuss');
    card.dataset.gasGroups = normalise(asset.gasGroups).join(' ');
    card.dataset.zones = normalise(asset.zones).join(' ');
    card.dataset.certifications = normalise(asset.certifications).join(' ');
    if (asset.image && image) {
      image.src = asset.image;
      image.alt = asset.imageAlt || `${card.querySelector('h2')?.textContent || 'Kaysons product'} photograph`;
      image.loading = 'lazy';
      card.classList.add('has-product-image');
    }
    if (discuss) discuss.dataset.product = card.querySelector('h2')?.textContent?.trim() || '';
    if (!copy || copy.querySelector('.product-resources')) return;
    const resources = document.createElement('div');
    resources.className = 'product-resources';
    resources.setAttribute('aria-label', 'Available product resources');
    if (asset.datasheet) resources.append(resourceNode('Technical datasheet', asset.datasheet));
    if (asset.catalogue) resources.append(resourceNode('Product catalogue', asset.catalogue));
    if (Array.isArray(asset.certificates) && asset.certificates.length) {
      asset.certificates.forEach((certificate) => {
        if (certificate?.href) resources.append(resourceNode(certificate.label || 'Certificate', certificate.href));
      });
    }
    if (!resources.children.length) resources.append(resourceNode('Technical details on request'));
    copy.append(resources);
  });

  const search = document.querySelector('#product-search');
  const protection = document.querySelector('#protection-filter');
  const gas = document.querySelector('#gas-filter');
  const zone = document.querySelector('#zone-filter');
  const certification = document.querySelector('#certification-filter');
  const reset = document.querySelector('.filter-reset');
  const count = document.querySelector('#filter-count');
  const grid = document.querySelector('.catalogue-grid');
  let emptyMessage = null;
  const activateFilter = (field, key) => { if (field) field.disabled = !productCards.some((card) => (card.dataset[key] || '').trim()); };
  activateFilter(gas, 'gasGroups'); activateFilter(zone, 'zones'); activateFilter(certification, 'certifications');
  if (grid && productCards.length) {
    emptyMessage = document.createElement('p');
    emptyMessage.className = 'filter-empty';
    emptyMessage.hidden = true;
    emptyMessage.textContent = 'No product group matches the selected filters. Reset the filters or discuss the application with Kaysons.';
    grid.append(emptyMessage);
  }
  const applyFilters = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const selected = { protection: protection?.value || '', gasGroups: gas?.value || '', zones: zone?.value || '', certifications: certification?.value || '' };
    let visible = 0;
    productCards.forEach((card) => {
      const matchText = !query || card.textContent.toLowerCase().includes(query);
      const matchData = Object.entries(selected).every(([key, value]) => !value || (card.dataset[key] || '').split(' ').includes(value));
      const show = matchText && matchData;
      card.classList.toggle('is-filtered-out', !show);
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} product group${visible === 1 ? '' : 's'}`;
    if (emptyMessage) emptyMessage.hidden = visible !== 0;
  };
  [search, protection, gas, zone, certification].forEach((field) => field?.addEventListener(field === search ? 'input' : 'change', applyFilters));
  reset?.addEventListener('click', () => {
    [search, protection, gas, zone, certification].forEach((field) => { if (field) field.value = ''; });
    applyFilters(); search?.focus();
  });

  /* EmailJS when configured; safe mail-client fallback otherwise. */
  const config = window.KAYSONS_SITE_CONFIG || {};
  const emailConfig = config.emailjs || {};
  const loadScript = (source, id) => new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) { if (existing.dataset.loaded === 'true') resolve(); else existing.addEventListener('load', resolve, { once: true }); return; }
    const script = document.createElement('script');
    script.id = id; script.src = source; script.async = true;
    script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });
  const timeout = (promise, ms = 12000) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

  const prepareMail = (form) => {
    const data = new FormData(form);
    const subject = `Website enquiry — ${data.get('product') || 'Hazardous-area requirement'}`;
    const message = [
      `Name: ${data.get('from_name') || ''}`, `Company: ${data.get('company') || ''}`,
      `Phone: ${data.get('phone') || ''}`, `Email: ${data.get('reply_to') || ''}`,
      `Product: ${data.get('product') || 'Not specified'}`, `Protection: ${data.get('protection') || 'Not specified'}`,
      '', String(data.get('message') || '')
    ].join('\n');
    location.href = `mailto:sales@kaysonstechno.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  document.querySelectorAll('.requirement-form, .modal-form').forEach((form) => {
    const requested = new URLSearchParams(location.search).get('product');
    const productField = form.querySelector('[name="product"]');
    if (requested && productField) productField.value = requested;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      const button = form.querySelector('button[type="submit"]');
      status?.classList.remove('is-success', 'is-error');
      if (!form.checkValidity()) {
        form.reportValidity();
        const invalid = form.querySelector(':invalid');
        invalid?.focus({ preventScroll: true });
        invalid?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        if (status) { status.textContent = 'Please complete the required fields and privacy consent.'; status.classList.add('is-error'); }
        return;
      }
      if (form.querySelector('[name="website"]')?.value) return;
      const configured = [emailConfig.publicKey, emailConfig.serviceId, emailConfig.templateId].every((value) => typeof value === 'string' && value.trim().length > 3);
      if (!configured) {
        if (status) { status.textContent = 'Opening your email application with the enquiry prepared.'; status.classList.add('is-success'); }
        prepareMail(form); return;
      }
      const original = button?.innerHTML || '';
      if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); button.textContent = 'Sending…'; }
      if (status) status.textContent = 'Sending your enquiry securely…';
      try {
        await timeout(loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', 'emailjs-sdk'));
        await timeout(window.emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form, { publicKey: emailConfig.publicKey }));
        if (status) { status.textContent = 'Thank you. Your requirement has been sent to the Kaysons sales team.'; status.classList.add('is-success'); }
        form.reset();
        if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_name: form.classList.contains('modal-form') ? 'modal_enquiry' : 'contact_enquiry' });
      } catch (error) {
        if (status) { status.textContent = 'The online service could not send the enquiry. Please email sales@kaysonstechno.com.'; status.classList.add('is-error'); }
      } finally {
        if (button) { button.disabled = false; button.removeAttribute('aria-busy'); button.innerHTML = original; }
      }
    });
  });

  /* Consent-based GA4 provision. */
  const analyticsId = config.analytics?.measurementId?.trim() || '';
  const consentKey = 'kaysons-analytics-consent';
  const loadAnalytics = () => {
    if (!/^G-[A-Z0-9]+$/i.test(analyticsId) || window.__kaysonsAnalyticsLoaded) return;
    window.__kaysonsAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, { allow_google_signals: false, allow_ad_personalization_signals: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`, 'kaysons-ga4').catch(() => {});
  };
  let consent = null;
  try { consent = localStorage.getItem(consentKey); } catch (error) {}
  if (consent === 'granted') loadAnalytics();
  else if (!consent && /^G-[A-Z0-9]+$/i.test(analyticsId)) {
    const banner = document.createElement('aside');
    banner.className = 'consent-banner';
    banner.setAttribute('aria-label', 'Analytics preference');
    banner.innerHTML = '<strong>Privacy preference</strong><p>Allow anonymous analytics to help Kaysons improve this website?</p><div><button type="button" data-consent="granted">Allow analytics</button><button type="button" data-consent="denied">Essential only</button></div>';
    body.append(banner);
    banner.querySelectorAll('[data-consent]').forEach((button) => button.addEventListener('click', () => {
      try { localStorage.setItem(consentKey, button.dataset.consent); } catch (error) {}
      if (button.dataset.consent === 'granted') loadAnalytics();
      banner.remove();
    }));
  }

  document.querySelectorAll('[data-manage-consent]').forEach((button) => button.addEventListener('click', () => {
    try { localStorage.removeItem(consentKey); } catch (error) {}
    location.reload();
  }));
})();
