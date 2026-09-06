/* Kaysons: progressive enhancement. All pages and product content render without JavaScript. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const config = window.KAYSONS_SITE_CONFIG || {};
  document.documentElement.classList.add("nav-ready");
  const safeStore = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (_) {}
    },
  };
  const header = $(".site-header");
  const nav = $(".primary-nav");
  const menu = $(".menu-toggle");
  const closeMenu = (restore = false) => {
    nav?.classList.remove("is-open");
    menu?.setAttribute("aria-expanded", "false");
    if (restore) menu?.focus();
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (menu?.getAttribute("aria-expanded") === "true") closeMenu(true);
      const disclosure = $(".filter-disclosure[open]");
      if (disclosure) {
        disclosure.open = false;
        $("summary", disclosure).focus();
      }
    }
  });
  document.addEventListener("click", (event) => {
    if (!header?.contains(event.target)) closeMenu();
    const filters = $(".filter-disclosure");
    if (filters && !filters.contains(event.target)) filters.open = false;
  });
  $$(".primary-nav a").forEach((link) =>
    link.addEventListener("click", () => closeMenu()),
  );
  window
    .matchMedia("(min-width: 800px)")
    .addEventListener("change", () => closeMenu());
  const back = $(".back-top");
  let ticking = false;
  const updateScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    if (back) back.hidden = window.scrollY < 900;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
  updateScroll();
  back?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
    $(".brand")?.focus({ preventScroll: true });
  });
  const directory = $(".category-directory");
  if (directory && window.matchMedia("(max-width: 799px)").matches)
    directory.open = false;

  const normalise = (value) =>
    Array.isArray(value)
      ? [
          ...new Set(
            value
              .map((item) => String(item).trim().toLowerCase())
              .filter(Boolean),
          ),
        ]
      : [];
  const safeResource = (value) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, location.href);
      return ["https:", "http:"].includes(url.protocol) ||
        (location.protocol === "file:" && url.protocol === "file:")
        ? url.href
        : "";
    } catch (_) {
      return "";
    }
  };
  const cards = $$(".product-card");
  const assets = window.KAYSONS_PRODUCT_ASSETS || {};
  cards.forEach((card) => {
    const asset = assets[card.id] || {};
    card.dataset.gasGroups = normalise(asset.gasGroups).join(" ");
    card.dataset.zones = normalise(asset.zones).join(" ");
    card.dataset.certifications = normalise(asset.certifications).join(" ");
    if (Array.isArray(asset.protection) && asset.protection.length)
      card.dataset.protection = normalise(asset.protection).join(" ");
    const source = safeResource(asset.image);
    if (source) {
      const img = document.createElement("img");
      img.className = "product-photograph";
      img.alt = asset.imageAlt || `${$("h2", card).textContent} by Kaysons`;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 800;
      img.height = 600;
      img.addEventListener("load", () => card.classList.add("has-photo"), {
        once: true,
      });
      img.addEventListener(
        "error",
        () => {
          img.remove();
          card.classList.remove("has-photo");
        },
        { once: true },
      );
      card.classList.add("has-photo");
      img.src = source;
      $(".product-media", card).append(img);
    }
    const resources = $(".product-resources", card);
    const addResource = (label, href) => {
      const url = safeResource(href);
      if (!url) return;
      const link = document.createElement("a");
      link.textContent = label;
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.dataset.download = label;
      resources.append(link);
    };
    addResource("Datasheet", asset.datasheet);
    addResource("Catalogue", asset.catalogue);
    if (Array.isArray(asset.certificates))
      asset.certificates.forEach((cert) => {
        if (cert && cert.href)
          addResource(cert.label || "Certificate", cert.href);
      });
  });
  const search = $("#product-search");
  const filterRoot = $(".filter-panel");
  const advanced = $("#advanced-filters");
  const vocabularies = [
    {
      key: "gasGroups",
      name: "Gas group",
      values: [
        ["i", "Group I"],
        ["iia", "IIA"],
        ["iib", "IIB"],
        ["iic", "IIC"],
      ],
    },
    {
      key: "zones",
      name: "Zone",
      values: [
        ["zone-1", "Zone 1"],
        ["zone-2", "Zone 2"],
        ["zone-21", "Zone 21"],
        ["zone-22", "Zone 22"],
      ],
    },
    {
      key: "certifications",
      name: "Certification",
      values: [
        ["iecex", "IECEx"],
        ["atex", "ATEX"],
        ["peso", "PESO"],
      ],
    },
  ];
  if (advanced)
    vocabularies.forEach((group) => {
      const available = group.values.filter(([value]) =>
        cards.some((card) =>
          card.dataset[group.key].split(" ").includes(value),
        ),
      );
      if (!available.length) return;
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = group.name;
      fieldset.append(legend);
      available.forEach(([value, label]) => {
        const row = document.createElement("label");
        row.className = "filter-option";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = group.key;
        input.value = value;
        const span = document.createElement("span");
        span.textContent = label;
        row.append(input, span);
        fieldset.append(row);
      });
      advanced.append(fieldset);
    });
  if (cards.length && search) {
    const fields = $$('input[type="checkbox"]', filterRoot);
    const labelFor = (field) =>
      field.name === "protection"
        ? field.value.replace("ex-", "Ex ")
        : field.closest("label").textContent.trim();
    const selectedGroups = () => {
      const groups = {};
      fields
        .filter((field) => field.checked)
        .forEach((field) => {
          (groups[field.name] ||= []).push(field.value);
        });
      return groups;
    };
    const syncFromURL = () => {
      const params = new URLSearchParams(location.search);
      search.value = params.get("q") || "";
      fields.forEach((field) => {
        field.checked = params.getAll(field.name).includes(field.value);
      });
    };
    const apply = (writeURL = true) => {
      const query = search.value.trim().toLowerCase();
      const words = query.split(/\s+/).filter(Boolean);
      const groups = selectedGroups();
      let visible = 0;
      cards.forEach((card) => {
        const text = (
          card.dataset.search +
          " " +
          card.dataset.protection +
          " " +
          card.dataset.gasGroups +
          " " +
          card.dataset.certifications
        ).toLowerCase();
        const matches =
          words.every((word) => text.includes(word)) &&
          Object.entries(groups).every(([key, values]) =>
            values.some((value) =>
              (card.dataset[key] || "").split(" ").includes(value),
            ),
          );
        card.hidden = !matches;
        if (matches) visible++;
      });
      const count = $("#product-count");
      count.textContent =
        visible === cards.length
          ? `Showing all ${visible} product families`
          : `Showing ${visible} of ${cards.length} product families`;
      $(".empty-state").hidden = visible !== 0;
      const checked = fields.filter((field) => field.checked);
      const badge = $(".filter-badge");
      badge.textContent = String(checked.length);
      badge.hidden = !checked.length;
      $(".reset-search").hidden = !checked.length && !query;
      const active = $("#active-filters");
      active.replaceChildren();
      active.hidden = !checked.length;
      checked.forEach((field) => {
        const button = document.createElement("button");
        button.type = "button";
        const label = labelFor(field);
        button.textContent = label + " ×";
        button.setAttribute("aria-label", "Remove " + label + " filter");
        button.addEventListener("click", () => {
          field.checked = false;
          apply();
          const next = $("#active-filters button");
          (next || $(".filter-disclosure summary")).focus();
        });
        active.append(button);
      });
      if (writeURL && location.protocol !== "file:") {
        const url = new URL(location.href);
        ["q", "protection", ...vocabularies.map((group) => group.key)].forEach(
          (key) => url.searchParams.delete(key),
        );
        if (query) url.searchParams.set("q", search.value.trim());
        Object.entries(groups).forEach(([key, values]) =>
          values.forEach((value) => url.searchParams.append(key, value)),
        );
        try {
          history.replaceState(null, "", url.href);
        } catch (_) {}
      }
    };
    syncFromURL();
    apply(false);
    search.addEventListener("input", () => apply());
    fields.forEach((field) => field.addEventListener("change", () => apply()));
    [...$$(".clear-filters"), $(".reset-search")]
      .filter(Boolean)
      .forEach((button) =>
        button.addEventListener("click", () => {
          search.value = "";
          fields.forEach((field) => (field.checked = false));
          apply();
        }),
      );
    $$(".category-directory nav a").forEach((link) =>
      link.addEventListener("click", () => {
        search.value = "";
        fields.forEach((field) => {
          field.checked = false;
        });
        apply();
        if (window.matchMedia("(max-width: 799px)").matches)
          directory.open = false;
      }),
    );
    $(".filter-done")?.addEventListener("click", () => {
      $(".filter-disclosure").open = false;
      $(".filter-disclosure summary").focus();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement.tagName,
        ) &&
        !document.activeElement.isContentEditable
      ) {
        event.preventDefault();
        search.focus();
      }
    });
    window.addEventListener("popstate", () => {
      syncFromURL();
      apply(false);
    });
  }

  const emailConfig = config.emailjs || {};
  const emailConfigured = ["publicKey", "serviceId", "templateId"].every(
    (key) =>
      typeof emailConfig[key] === "string" &&
      emailConfig[key].trim().length > 3,
  );
  const loadScript = (src, id) =>
    new Promise((resolve, reject) => {
      let element = document.getElementById(id);
      if (element?.dataset.loaded === "true") return resolve();
      if (element) element.remove();
      element = document.createElement("script");
      element.id = id;
      element.src = src;
      element.async = true;
      element.onload = () => {
        element.dataset.loaded = "true";
        resolve();
      };
      element.onerror = () => {
        element.remove();
        reject(new Error("Script unavailable"));
      };
      document.head.append(element);
    });
  const timed = (promise, ms) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Delivery not confirmed")),
        ms,
      );
      promise.then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (error) => {
          clearTimeout(timer);
          reject(error);
        },
      );
    });
  const form = $("#requirement-form");
  if (form) {
    const submit = $(".form-submit", form);
    const status = $(".form-status", form);
    const productField = $("#product");
    const prepared = $(".prepared-enquiry");
    submit.disabled = false;
    const requested = new URLSearchParams(location.search).get("product");
    if (requested) {
      const option = Array.from(productField.options).find(
        (item) => item.value === requested || item.textContent === requested,
      );
      if (option) productField.value = option.value;
    }
    if (emailConfigured) {
      $("span", submit).textContent = "Send enquiry";
      $(".form-note", form).textContent =
        "Your requirement will be emailed to the Kaysons sales team.";
    }
    const validateField = (field) => {
      const error = $("#" + field.id + "-error");
      if (!error) return field.checkValidity();
      let message = "";
      if (field.type !== "checkbox" && !field.value.trim())
        message = "Please complete this field.";
      else if (field.validity.valueMissing)
        message =
          field.type === "checkbox"
            ? "Please agree so we can respond to your enquiry."
            : "Please complete this field.";
      else if (field.validity.typeMismatch)
        message = "Enter a valid email address.";
      else if (!field.validity.valid) message = "Please check this value.";
      error.textContent = message;
      if (message) {
        field.setAttribute("aria-invalid", "true");
        field.setAttribute("aria-describedby", error.id);
      } else {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
      }
      return !message;
    };
    $$("[required]", form).forEach((field) => {
      field.addEventListener("blur", () => {
        if (field.value || field.getAttribute("aria-invalid"))
          validateField(field);
      });
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid")) validateField(field);
      });
      field.addEventListener("change", () => {
        if (field.getAttribute("aria-invalid")) validateField(field);
      });
    });
    const compose = () => {
      const data = new FormData(form);
      const productName = productField.value
        ? productField.selectedOptions[0].textContent
        : "Product selection assistance";
      const subject = `Website enquiry — ${productName}`;
      const text = [
        `Name: ${String(data.get("from_name") || "").trim()}`,
        `Company: ${String(data.get("company") || "").trim()}`,
        `Work email: ${String(data.get("reply_to") || "").trim()}`,
        `Phone: ${String(data.get("phone") || "").trim()}`,
        `Product family: ${productName}`,
        `Protection concept: ${data.get("protection") || "Not specified"}`,
        `Project stage: ${data.get("project_stage") || "Not specified"}`,
        "",
        "Requirement:",
        String(data.get("message") || "").trim(),
        "",
        "Privacy consent: Yes",
      ].join("\n");
      return {
        subject,
        text,
        href: `mailto:sales@kaysonstechno.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
      };
    };
    const showPrepared = (mail, openEmail = false) => {
      $("#copy-enquiry").textContent = "Copy details";
      $("#prepared-text").value = `${mail.subject}\n\n${mail.text}`;
      $("#prepared-mail").href = mail.href;
      prepared.hidden = false;
      if (openEmail) location.href = mail.href;
    };
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if ($('[name="website"]', form)?.value) return;
      const invalid = $$("[required]", form).filter(
        (field) => !validateField(field),
      );
      status.className = "form-status";
      if (invalid.length) {
        status.classList.add("is-error");
        status.textContent = "Please check the highlighted fields.";
        invalid[0].focus();
        return;
      }
      const mail = compose();
      if (!emailConfigured) {
        showPrepared(mail);
        status.textContent =
          "Your enquiry is prepared. Open your email app below to review and send it.";
        status.focus({ preventScroll: true });
        prepared.scrollIntoView({
          behavior: reduced.matches ? "auto" : "smooth",
          block: "nearest",
        });
        return;
      }
      submit.disabled = true;
      submit.setAttribute("aria-busy", "true");
      $("span", submit).textContent = "Sending…";
      status.textContent = "Sending your enquiry…";
      prepared.hidden = true;
      try {
        await timed(
          loadScript(
            "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
            "emailjs-sdk",
          ),
          10000,
        );
        if (!window.emailjs?.send) throw new Error("Email service unavailable");
        const params = Object.fromEntries(new FormData(form).entries());
        params.product = productField.value
          ? productField.selectedOptions[0].textContent
          : "Product selection assistance";
        params.subject = mail.subject;
        params.to_email = "sales@kaysonstechno.com";
        await timed(
          window.emailjs.send(
            emailConfig.serviceId,
            emailConfig.templateId,
            params,
            { publicKey: emailConfig.publicKey },
          ),
          15000,
        );
        status.classList.add("is-success");
        status.textContent =
          "Thank you. Your enquiry has been sent to the Kaysons sales team.";
        form.reset();
        track("generate_lead", { form_name: "contact_enquiry" });
        status.focus({ preventScroll: true });
      } catch (_) {
        status.classList.add("is-error");
        status.textContent =
          "We could not confirm online delivery. Your details are preserved below so you can email the sales team.";
        showPrepared(mail);
      } finally {
        submit.disabled = false;
        submit.removeAttribute("aria-busy");
        $("span", submit).textContent = "Send enquiry";
      }
    });
    $("#copy-enquiry")?.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const value = $("#prepared-text").value;
      try {
        if (!navigator.clipboard?.writeText)
          throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(value);
        button.textContent = "Copied";
        status.textContent =
          "Enquiry copied. Paste it into an email to sales@kaysonstechno.com.";
      } catch (_) {
        const text = $("#prepared-text");
        text.focus();
        text.select();
        button.textContent = "Text selected";
        status.textContent =
          "Copy the selected text and paste it into your email.";
      }
    });
  }

  // Analytics remains opt-in, and no tracking loads without a valid ID and consent.
  const analyticsId = String(config.analytics?.measurementId || "").trim();
  const validAnalytics = /^G-[A-Z0-9]+$/i.test(analyticsId);
  const consentKey = "kaysons-analytics-consent";
  let consent = safeStore.get(consentKey);
  let analyticsLoaded = false;
  function track(name, values = {}) {
    if (
      consent === "granted" &&
      analyticsLoaded &&
      typeof window.gtag === "function"
    )
      window.gtag("event", name, values);
  }
  const loadAnalytics = () => {
    if (!validAnalytics || consent !== "granted") return;
    window["ga-disable-" + analyticsId] = false;
    if (analyticsLoaded) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    loadScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`,
      "kaysons-ga4",
    ).catch(() => {});
  };
  const showConsent = () => {
    if (!validAnalytics || $(".consent-banner")) return;
    const panel = document.createElement("aside");
    panel.className = "consent-banner";
    panel.setAttribute("aria-label", "Analytics preference");
    panel.innerHTML =
      '<strong>Your privacy preferences</strong><p>Allow website usage analytics to help Kaysons improve the site? Your enquiry details are not included.</p><div><button type="button" data-consent="granted">Allow analytics</button><button type="button" data-consent="denied">Essential only</button></div>';
    document.body.append(panel);
    $$("[data-consent]", panel).forEach((button) =>
      button.addEventListener("click", () => {
        consent = button.dataset.consent;
        safeStore.set(consentKey, consent);
        if (consent === "granted") loadAnalytics();
        else {
          window["ga-disable-" + analyticsId] = true;
          if (typeof window.gtag === "function")
            window.gtag("consent", "update", { analytics_storage: "denied" });
        }
        panel.remove();
      }),
    );
  };
  if (validAnalytics) {
    if (consent === "granted") loadAnalytics();
    else if (!consent) showConsent();
    $$("[data-manage-consent]").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", showConsent);
    });
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.startsWith("tel:"))
      track("phone_click", { link_text: link.textContent.trim() });
    else if (href.startsWith("mailto:")) track("email_click");
    else if (link.dataset.download)
      track("file_download", {
        document_type: link.dataset.download,
        product_family: link.closest(".product-card")?.id || "",
      });
    else if (href.includes("contact.html"))
      track("enquiry_click", {
        placement: link.closest("header")
          ? "header"
          : link.closest("footer")
            ? "footer"
            : "page",
      });
  });
})();
